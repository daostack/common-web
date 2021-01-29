import admin from 'firebase-admin';
import Timestamp = admin.firestore.Timestamp;

import { Collections } from '../../util/constants';
import { ISubscriptionEntity } from '../types';

const db = admin.firestore()

/**
 * Updates subscription in the firestore using .update()
 *
 * @param subscription - The updated subscription
 * @param subscriptionId - **Optional** - The id of the subscription. If not provided the id from the subscription object will be used
 */
export const updateSubscription = async (subscription: ISubscriptionEntity, subscriptionId?: string): Promise<void> => {
  subscription.updatedAt = Timestamp.now()

  await db.collection(Collections.Subscriptions)
    .doc(subscriptionId || subscription.id)
    .update(subscription);
};