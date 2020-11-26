import admin from 'firebase-admin';
import { QuerySnapshot } from '@google-cloud/firestore';

import { ISubscriptionEntity } from '../types';
import { Collections } from '../../util/constants';
import { CommonError } from '../../util/errors';

import { CancellationReason } from './cancelSubscription';
import { revokeMembership } from './revokeMembership';

const db = admin.firestore();

/**
 * Revokes all membership that are expired, but not yet revoked
 */
export const revokeMemberships = async (): Promise<void> => {
  console.info(`Beginning membership revoking for ${new Date().getDate()}`);

  // Only get the subscription cancelled by user, because the subscriptions
  // canceled by payment failure should already be revoked
  const subscriptions = await db.collection(Collections.Subscriptions)
    .where('dueDate', '<=', new Date().setHours(23, 59, 59, 999))
    .where('status', '==', CancellationReason.CanceledByUser)
    .where('revoked', '==', false)
    .get() as QuerySnapshot<ISubscriptionEntity>;

  const promiseArr: Promise<any>[] = [];

  for (const subscriptionSnap of subscriptions.docs) {
    const subscription = subscriptionSnap.data() as ISubscriptionEntity;

    if (subscription.status === 'Active' || subscription.status === 'PaymentFailed') {
      console.error(
        new CommonError(`
            Trying to revoke subscription with status 
            (${subscription.status}) from the cron
          `)
      );
    } else {
      promiseArr.push((async () => {
        // Add try/catch so that if one revoke fails
        // the others won't be canceled because of it
        try {
          console.info(`Revoking membership for subscription with id ${subscription.id}`);

          await revokeMembership(subscription);

          console.info(`Revoked membership ${subscription.id}`);
        } catch (e) {
          console.error('Error occurred while trying to revoke subscription', e);
        }
      })());
    }
  }

  await Promise.all(promiseArr);

  console.info(`Memberships revoked successfully`);
};