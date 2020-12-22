import * as yup from 'yup';

import { ISubscriptionPayment } from '../types';
import { validate } from '../../../util/validate';
import { subscriptionDb } from '../../../subscriptions/database';
import { createPayment } from './createPayment';
import { pollPayment } from './pollPayment';
import { EVENT_TYPES } from '../../../event/event';
import { createEvent } from '../../../util/db/eventDbService';
import { isFinalized, isSuccessful } from '../helpers';
import { handleFailedSubscriptionPayment, handleSuccessfulSubscriptionPayment } from '../../../subscriptions/business';
import { proposalDb } from '../../../proposals/database';

const createSubscriptionPaymentValidationSchema = yup.object({
  subscriptionId: yup.string()
    .uuid()
    .required(),

  ipAddress: yup.string()
    .required(),

  sessionId: yup.string()
    .required(),
});


export const createSubscriptionPayment = async (payload: yup.InferType<typeof createSubscriptionPaymentValidationSchema>): Promise<ISubscriptionPayment> => {
  // Validate the data
  await validate(payload, createSubscriptionPaymentValidationSchema);

  // Find the subscription
  const subscription = await subscriptionDb.get(payload.subscriptionId);

  // The cardID and if the user is the owner of that card will be validated in that function. Also the Id of the
  // proposal will be used as idempotency key, so we are insured that only one payment will be made for one proposal
  // (of one-time type)
  let payment = await createPayment({
    userId: subscription.userId,
    cardId: subscription.cardId,
    ipAddress: payload.ipAddress,
    sessionId: payload.sessionId,

    type: 'subscription',
    amount: subscription.amount,
    objectId: subscription.id
  });


  logger.info(`Starting polling subscription payment with ID ${payment.id}`, {
    payment,
    subscription
  });

  // If this is the initial subscription charge
  // update the proposal as well
  if (subscription.charges === 0) {
    logger.info('Creating initial subscription charge. Marking it as pending', {
      subscription,
      payment
    });

    await proposalDb.update({
      id: subscription.proposalId,
      paymentState: 'pending'
    });
  }

  // Poll the payment
  payment = await pollPayment(payment);

  logger.info(`Polling finished for subscription payment with ID ${payment.id} with status ${payment.status}`, {
    payment,
    subscription
  });


  if (isSuccessful(payment)) {
    await createEvent({
      type: EVENT_TYPES.SUBSCRIPTION_PAYMENT_CONFIRMED,
      objectId: payment.id,
      userId: payment.userId
    });

    await handleSuccessfulSubscriptionPayment(subscription);
  } else if (isFinalized(payment)) {
    await createEvent({
      type: EVENT_TYPES.SUBSCRIPTION_PAYMENT_FAILED,
      objectId: payment.id,
      userId: payment.userId
    });

    await handleFailedSubscriptionPayment(subscription, payment);
  } else {
    await createEvent({
      type: EVENT_TYPES.SUBSCRIPTION_PAYMENT_STUCK,
      objectId: payment.id,
      userId: payment.userId
    });

    logger.warn('Payment is not in finalized or successful state after polling', { payment });
  }

  return payment as ISubscriptionPayment;
};