import { ISubscriptionEntity } from '../types';
import { CommonError } from '../../util/errors';
import { updateSubscription } from '../database/updateSubscription';
import { revokeMembership } from './revokeMembership';
import { IPaymentEntity } from '../../circlepay/payments/types';
import { proposalDb } from '../../proposals/database';

/**
 * Handles update for the subscription document on payment failure
 *
 * @param subscription - The subscription that we want to update
 * @param payment - The failed payment
 *
 * @throws { CommonError } - If the subscription status is not 'Active' or 'PaymentFailed'
 */
export const handleFailedSubscriptionPayment = async (subscription: ISubscriptionEntity, payment: IPaymentEntity): Promise<void> => {
  const failedPayment = {
    paymentStatus: payment.status,
    paymentId: payment.id
  };

  if (subscription.status === 'Active') {
    subscription.status = 'PaymentFailed';
    subscription.paymentFailures = [failedPayment];
  } else if (subscription.status === 'PaymentFailed') {
    subscription.paymentFailures.push(failedPayment);

    await updateSubscription(subscription);

    // If there are more than 3 failed payment cancel
    // the subscription (so on the 4th attempt)
    if (subscription.paymentFailures.length > 3) {
      await revokeMembership(subscription);
    }
  } else {
    throw new CommonError(`
      Payment failed for unsupported payment status (${subscription.status}) 
      for subscription with id ${subscription.id}
    `);
  }

  // Update metadata about the subscription
  subscription.charges = (subscription.charges || 0) + 1;

  await Promise.all([
    updateSubscription(subscription),
    await proposalDb.update({
      id: subscription.proposalId,
      paymentState: 'failed'
    })
  ]);
};