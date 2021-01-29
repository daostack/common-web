import axios from 'axios';
import * as yup from 'yup';

import { ErrorCodes } from '../../../constants';
import { circlePayApi } from '../../../settings';
import { validate } from '../../../util/validate';
import { externalRequestExecutor } from '../../../util';
import { billingDetailsValidationSchema } from '../../../util/schemas';

import { ICircleCreateCardPayload, ICircleCreateCardResponse } from '../../types';
import { getCircleHeaders } from '../../index';
import { ICardEntity } from '../types';
import { userDb } from '../../../users/database';
import { cardDb } from '../database';
import { createEvent } from '../../../util/db/eventDbService';
import { EVENT_TYPES } from '../../../event/event';
import { pollCard } from './pollCard';

const createCardValidationSchema = yup.object({
  ownerId: yup.string()
    .required(),

  billingDetails: billingDetailsValidationSchema
    .required(),

  keyId: yup
    .string()
    .required(),

  sessionId: yup
    .string()
    .required(),

  ipAddress: yup
    .string()
    .required(),

  encryptedData: yup
    .string()
    .required(),

  expMonth: yup
    .number()
    .min(1)
    .max(12)
    .required(),

  expYear: yup
    .number()
    .min(new Date().getFullYear())
    .max(new Date().getFullYear() + 50)
    .required()
});

type CreateCardPayload = yup.InferType<typeof createCardValidationSchema>;

/**
 * Creates card in the FireStore and on Circle side.
 *
 * @param payload
 */
export const createCard = async (payload: CreateCardPayload = {}): Promise<ICardEntity> => {
  // Validate the passed data
  await validate(payload, createCardValidationSchema);

  // Find the creator
  const user = await userDb.get(payload.ownerId);

  // Format the data for circle
  const headers = await getCircleHeaders();
  const data: ICircleCreateCardPayload = {
    billingDetails: payload.billingDetails as any,
    encryptedData: payload.encryptedData,
    expMonth: payload.expMonth,
    expYear: payload.expYear,
    idempotencyKey: payload.sessionId,
    keyId: payload.keyId,
    metadata: {
      email: user.email,
      ipAddress: payload.ipAddress,
      sessionId: payload.sessionId
    }
  };

  // @todo Move this to the circle client
  // Create the card on Circle
  const { data: response } = await externalRequestExecutor<ICircleCreateCardResponse>(async () => {
    logger.debug('Trying to create new card with circle', {
      data
    });

    return (await axios.post<ICircleCreateCardResponse>(`${circlePayApi}/cards`,
      data,
      headers
    )).data;
  }, {
    errorCode: ErrorCodes.CirclePayError,
    userMessage: 'Cannot create the card, because it was rejected by Circle'
  });

  // Check if the use already has the same card
  const existingCards = await cardDb.getMany({
    ownerId: user.uid,
    circleCardId: response.id
  });

  if (existingCards.length) {
    //  note to self:
    //    this should not end up deployed as we currently
    //    have no UI for that, so we are creating new card
    //    on every request. Just return the found card without
    //    saving it again
    //
    // ========================================================================
    //
    // throw new CommonError(`Cannot resave the same card for the same user!`, {
    //   cardId: response.id,
    //   userId: user.id
    // });
    return existingCards[0];
  }


  // If the card was created successfully save it
  const card = await cardDb.add({
    ownerId: user.uid,
    circleCardId: response.id,
    metadata: {
      billingDetails: data.billingDetails,
      digits: response.last4,
      network: response.network
    },
    verification: {
      cvv: response.verification.cvv as any
    }
  });

  // After the card is saved check the status of the card
  await pollCard(card);

  // Create event
  await createEvent({
    type: EVENT_TYPES.CARD_CREATED,
    userId: user.uid,
    objectId: card.id
  });

  // Return the created card
  return card;
};