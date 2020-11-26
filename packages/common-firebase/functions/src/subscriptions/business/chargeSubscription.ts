import moment from 'moment';

import { ISubscriptionEntity } from '../types';
import { CommonError } from '../../util/errors';

import { EVENT_TYPES } from '../../event/event';
import { createSubscriptionPayment } from '../../circlepay/createSubscriptionPayment';
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
  if (moment(subscription.dueDate.toDate()).isSameOrBefore(new Date(), 'day')) {
    throw new CommonError(`Trying to charge subscription ${subscription.id}, but the due date is in the future!`, {
      subscription
    });
  }

  try {
    await createSubscriptionPayment(subscription);

    await createEvent({
      userId: subscription.userId,
      objectId: subscription.id,
      type: EVENT_TYPES.SUBSCRIPTION_PAYMENT_CREATED
    });
  } catch (e) {
    console.error(new CommonError(`
      Payment for subscription (${subscription.id}) has failed!
    `));

    await createEvent({
      userId: subscription.userId,
      objectId: subscription.id,
      type: EVENT_TYPES.SUBSCRIPTION_PAYMENT_FAILED
    });
  }
};