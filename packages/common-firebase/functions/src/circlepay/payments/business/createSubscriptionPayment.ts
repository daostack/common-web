import { ISubscriptionPayment } from '../types';
import { v4 } from 'uuid';

import * as yup from 'yup';
import { validate } from '../../../util/validate';
import { subscriptionDb } from '../../../subscriptions/database';
import { createPayment } from './createPayment';
import { pollPaymentStatus } from './pollPaymentStatus';
import { isFinalized, isSuccessful } from '../helpers';
import { handleFailedPayment, handleSuccessfulSubscriptionPayment } from '../../../subscriptions/business';

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
    objectId: v4()
  });

  // let payment = await createPayment({
  //   userId: proposal.proposerId,
  //   cardId: proposal.join.cardId,
  //   ipAddress: payload.ipAddress,
  //   sessionId: payload.sessionId,
  //
  //   type: 'one-time',
  //   amount: proposal.join.funding,
  //   objectId: proposal.id
  // });

  // Poll the payment
  payment = await pollPaymentStatus(payment);

  if (isSuccessful(payment)) {
    await handleSuccessfulSubscriptionPayment(subscription);
  } else if (isFinalized(payment)) {
    await handleFailedPayment(subscription, payment);
  } else {
    logger.warn('Payment is not in finalized or successful state after polling {payment}', payment);
  }

  return payment as ISubscriptionPayment;
};