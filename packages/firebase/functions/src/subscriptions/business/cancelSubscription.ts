import { ISubscriptionEntity } from '@common/types';

import { EVENT_TYPES } from '../../event/event';
import { createEvent } from '../../util/db/eventDbService';
import { updateSubscription } from '../database/updateSubscription';
import { revokeMembership } from './revokeMembership';

export enum CancellationReason {
  CanceledByUser = 'CanceledByUser',
  CanceledByPaymentFailure = 'CanceledByPaymentFailure'
}


/**
 * Cancel recurring payment so the user is not charged again. Does not revoke memberships!
 *
 * @param subscription
 * @param cancellationReason - whether the user canceled or the payment has failed multiple times
 */
export const cancelSubscription = async (subscription: ISubscriptionEntity, cancellationReason: CancellationReason): Promise<void> => {
  subscription.status = cancellationReason;

  await updateSubscription(subscription);

  // If the subscription is canceled by payment failure we shoukd
  if (cancellationReason === CancellationReason.CanceledByPaymentFailure) {
    await revokeMembership(subscription);
  }

  await createEvent({
    userId: subscription.userId,
    objectId: subscription.id,
    type: cancellationReason === CancellationReason.CanceledByPaymentFailure
      ? EVENT_TYPES.SUBSCRIPTION_CANCELED_BY_PAYMENT_FAILURE
      : EVENT_TYPES.SUBSCRIPTION_CANCELED_BY_USER
  });
};