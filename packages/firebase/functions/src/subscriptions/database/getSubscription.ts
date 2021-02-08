import { ISubscriptionEntity } from '@common/types';
import admin from 'firebase-admin';

import { Collections } from '../../util/constants';
import { CommonError, NotFoundError } from '../../util/errors';
import { Nullable } from '../../util/types';

const db = admin.firestore();

/**
 * Finds subscription with type safety (throws error if no subscription is found)
 *
 * @param subscriptionId - The id of the subscription we want to find
 * @param throwErr - Whether NotFoundError will be thrown if the subscription is not found
 *
 * @throws { CommonError } - If the subscription ID is not provided
 * @throws { CommonError } - If the subscription was not found
 * @throws { NotFoundError } - If the subscription is not found and the throwErr is true
 *
 * @returns { ISubscriptionEntity } - The found subscription
 */
export const getSubscription = async (subscriptionId: Nullable<string>, throwErr = true): Promise<ISubscriptionEntity> => {
  if (!subscriptionId) {
    throw new CommonError('Cannot get subscription without providing the id!');
  }

  const subscription = (await db.collection(Collections.Subscriptions)
    .doc(subscriptionId)
    .get()).data() as Nullable<ISubscriptionEntity>;

  if (!subscription && throwErr) {
    throw new NotFoundError(subscriptionId, 'subscription');
  }

  return subscription;
};