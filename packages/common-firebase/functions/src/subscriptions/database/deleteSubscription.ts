import admin from 'firebase-admin';

import WriteResult = admin.firestore.WriteResult;

import { Nullable } from '../../util/types';
import { Collections } from '../../util/constants';
import { CommonError } from '../../util/errors';

const db = admin.firestore();

/**
 * Deletes subscription
 *
 * @param subscriptionId - The id of the subscription we want to delete
 *
 * @throws { CommonError } - If the subscription ID is not provided
 */
export const deleteSubscription = async (subscriptionId: Nullable<string>): Promise<WriteResult> => {
  if (!subscriptionId) {
    throw new CommonError('Cannot get subscription without providing the id!');
  }

  return (await db.collection(Collections.Subscriptions)
    .doc(subscriptionId)
    .delete());
};