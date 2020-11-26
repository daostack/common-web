import admin from 'firebase-admin';

import { ISubscriptionEntity, Nullable } from '../../util/types';
import { Collections } from '../../util/constants';
import { CommonError, NotFoundError } from '../../util/errors';

const db = admin.firestore();

/**
 * Finds subscription with type safety (throws error if no subscription is found)
 *
 * @param subscriptionId - The id of the subscription we want to find
 *
 * @throws { CommonError } - If the subscription ID is not provided
 * @throws { CommonError } - If the subscription was not found
 *
 * @returns { ISubscriptionEntity } - The found subscription
 */
export const getSubscription = async (subscriptionId: Nullable<string>): Promise<ISubscriptionEntity> => {
  if (!subscriptionId) {
    throw new CommonError('Cannot get subscription without providing the id!');
  }

  const subscription = (await db.collection(Collections.Subscriptions)
    .doc(subscriptionId)
    .get()).data() as Nullable<ISubscriptionEntity>;

  if (!subscription) {
    throw new NotFoundError(subscriptionId, 'subscription');
  }

  return subscription;
};