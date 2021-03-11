import * as yup from 'yup';

import { validate } from '../../../util/validate';
import { subscriptionDb } from '../../../subscriptions/database';
import { createPayment } from './createPayment';
import { pollPayment } from './pollPayment';
import { proposalDb } from '../../../proposals/database';
import { IPaymentEntity } from '../types';
import { handleFinalizedSubscriptionPayment } from './handlers/subscriptions/handleFinalizedSubscriptionPayment';
import { isFinalized } from '../helpers';

const createSubscriptionPaymentValidationSchema = yup.object({
  subscriptionId: yup.string()
    .uuid()
    .required(),

  sessionId: yup.string()
    .required()
});


export const createSubscriptionPayment = async (payload: yup.InferType<typeof createSubscriptionPaymentValidationSchema>): Promise<IPaymentEntity> => {
  // Validate the data
  await validate(payload, createSubscriptionPaymentValidationSchema);

  // Find the subscription and the proposal for it
  const subscription = await subscriptionDb.get(payload.subscriptionId);
  const subscriptionJoin = await proposalDb.getJoinRequest(subscription.proposalId);

  // The cardID and if the user is the owner of that card will be validated in that function. Also the Id of the
  // proposal will be used as idempotency key, so we are insured that only one payment will be made for one proposal
  // (of one-time type)
  let payment = await createPayment({
    userId: subscription.userId,
    cardId: subscription.cardId,
    ipAddress: subscriptionJoin.join.ip || '127.0.0.1', // The local host is for backwards compatibility
    sessionId: payload.sessionId,

    type: 'subscription',
    amount: subscription.amount,

    proposalId: subscription.proposalId,
    commonId: subscription.metadata.common.id,
    subscriptionId: subscription.id
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

  // Process the payment if it is finalize. If it is not something went wrong
  if (isFinalized(payment)) {
    await handleFinalizedSubscriptionPayment(subscription, payment);
  } else {
    logger.error('Payment not finalized after poling', {
      payment
    });
  }

  return payment;
};