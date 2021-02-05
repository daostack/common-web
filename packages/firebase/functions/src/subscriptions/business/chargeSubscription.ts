import { ISubscriptionEntity } from '@common/types';
import moment from 'moment';
import { v4 } from 'uuid';

import { createSubscriptionPayment } from '../../circlepay/payments/business/createSubscriptionPayment';
import { EVENT_TYPES } from '../../event/event';
import { createEvent } from '../../util/db/eventDbService';
import { subscriptionDb } from '../database';

/**
 * Charges one subscription (only if the due date is
 * today or in the past) by the subscription id
 *
 * @param subscriptionId - the id of the subscription, that we want to charge
 */
export const chargeSubscriptionById = async (subscriptionId: string): Promise<void> => {
  await chargeSubscription(
    await subscriptionDb.get(subscriptionId)
  );
};

/**
 * Charges one subscription (only if the due date is
 * today or in the past) by the subscription entity
 *
 * @param subscription - the subscription entity
 */
export const chargeSubscription = async (subscription: ISubscriptionEntity): Promise<void> => {
  // Check if the due date is in the past (only the date and not the time)
  if (!moment(subscription.dueDate.toDate()).isSameOrBefore(new Date(), 'day')) {
    logger.error(`Trying to charge subscription ${subscription.id}, but the due date is in the future!`, {
      subscription
    });

    return;
  }

  try {
    await createSubscriptionPayment({
      subscriptionId: subscription.id,
      sessionId: v4()
    });
  } catch (e) {
    logger.error('Payment for subscription has failed!', {
      subscriptionId: subscription.id
    });

    await createEvent({
      userId: subscription.userId,
      objectId: subscription.id,
      type: EVENT_TYPES.SUBSCRIPTION_PAYMENT_FAILED
    });
  }
};