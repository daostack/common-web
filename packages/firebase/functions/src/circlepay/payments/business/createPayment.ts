import axios from 'axios';
import * as yup from 'yup';
import { v4 } from 'uuid';

import { IPaymentEntity } from '../types';
import { validate } from '../../../util/validate';
import { getCircleHeaders } from '../../index';
import { ICircleCreatePaymentPayload, ICircleCreatePaymentResponse } from '../../types';
import { userDb } from '../../../core/domain/users/database';
import { externalRequestExecutor } from '../../../util';
import { circlePayApi } from '../../../settings';
import { ErrorCodes } from '../../../constants';
import { paymentDb } from '../database';
import { createEvent } from '../../../util/db/eventDbService';
import { EVENT_TYPES } from '../../../event/event';
import { cardDb } from '../../cards/database';
import { CommonError, CvvVerificationError } from '../../../util/errors';

const createPaymentValidationSchema = yup.object({
  userId: yup.string()
    .required(),

  cardId: yup.string()
    .uuid()
    .required(),

  proposalId: yup.string()
    .required(),

  subscriptionId: yup.string()
    .when('type', {
      is: 'subscription',
      then: yup.string().required()
    }),

  ipAddress: yup.string()
    .required(),

  sessionId: yup.string()
    .required(),

  amount: yup.number()
    .required(),

  type: yup.string()
    .oneOf(['one-time', 'subscription'])
    .required(),

  encryptedData: yup.string()
    .when('type', {
      is: 'one-time',
      then: yup.string() //.required()
    }),

  keyId: yup.string()
    .when('type', {
      is: 'one-time',
      then: yup.string() //.required()
    })
});

interface ICreatePaymentPayload extends yup.InferType<typeof createPaymentValidationSchema> {
  /**
   * This is the ID of the object that we are charging (the proposal in this case). It is used
   * as idempotency key, so we don't charge more than one time for one thing
   */
  proposalId: string;

  /**
   * This is the amount that the source will be charged in US dollar cents
   */
  amount: number;
}

/**
 * This function only creates the payment with circle and saves it in the database. No polling is done here.
 * Please do not use directly or use with caution.
 *
 * @throws { CommonError } - If the card is not owned by the user
 *
 * @param payload - The data needed for creating payment
 */
export const createPayment = async (payload: ICreatePaymentPayload): Promise<IPaymentEntity> => {
  // Validate the data
  await validate(payload, createPaymentValidationSchema);

  // Find the payment initiator
  const user = await userDb.get(payload.userId);
  const card = await cardDb.get(payload.cardId);

  // If the user is not the owner of the card throw an error
  if (card.ownerId !== user.uid) {
    throw new CommonError('Cannot charge card, that you do not own', {
      card,
      user
    });
  }

  // If the card has failed CVV verification check do not allow the payment
  // In real cases we should never end up here
  if (card.verification && card.verification.cvv !== 'pass') {
    logger.warn('Payment is attempted on card without CVV verification pass', {
      card,
      paymentCreationPayload: payload
    });

    throw new CvvVerificationError(card.id);
  }

  // Format the data for circle
  const headers = await getCircleHeaders();
  const circleData: ICircleCreatePaymentPayload = {
    amount: {
      // In our code all money values should be in cents
      amount: payload.amount / 100,
      currency: 'USD'
    },

    source: {
      type: 'card',
      id: card.circleCardId
    },

    metadata: {
      email: user.email,
      ipAddress: payload.ipAddress,
      sessionId: payload.sessionId
    },

    idempotencyKey: payload.type === 'one-time'
      ? payload.proposalId
      : v4(), // @todo This will not work for the second subscription payment, so append the
              //    times that the subscription has been charged?

    verification: 'none'
  };

  // Create the request @todo Handle errors better
  const { data: response } = await externalRequestExecutor<ICircleCreatePaymentResponse>(async () => {
    logger.debug('Creating payment in Circle', {
      data: circleData
    });

    return (await axios.post<ICircleCreatePaymentResponse>(`${circlePayApi}/payments`,
      circleData,
      headers
    )).data;
  }, {
    errorCode: ErrorCodes.CirclePayError,
    userMessage: 'Call to CirclePay failed. Please try again later and if the issue persist contact us.'
  });

  // Save the payment
  const payment = await paymentDb.add({
    amount: {
      amount: payload.amount,
      currency: 'USD'
    },

    source: {
      type: 'card',
      id: card.id
    },

    type: payload.type,
    proposalId: payload.proposalId,
    userId: user.uid,
    status: response.status,
    circlePaymentId: response.id,

    // Add the subscription ID to the entity if the payment is for subscription
    ...(payload.subscriptionId && {
      subscriptionId: payload.subscriptionId
    })
  });

  logger.debug('New payment created', {
    payment
  });

  // Create event
  await createEvent({
    type: EVENT_TYPES.PAYMENT_CREATED,
    userId: user.uid,
    objectId: payment.id
  });

  // @todo Schedule polling?

  // Return the created payment
  return payment;
};