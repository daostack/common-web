import admin from 'firebase-admin';
import { QuerySnapshot } from '@google-cloud/firestore';

import { ISubscriptionEntity } from '../types';
import { Collections } from '../../util/constants';

import { CancellationReason } from './cancelSubscription';
import { revokeMembership } from './revokeMembership';

const db = admin.firestore();

/**
 * Revokes all membership that are expired, but not yet revoked
 */
export const revokeMemberships = async (): Promise<void> => {
  logger.info(`Beginning membership revoking for ${new Date().getDate()}`);

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
      logger.warn(
        `
            Trying to revoke subscription with status 
            (${subscription.status}) from the cron
          `
      );
    } else {
      // eslint-disable-next-line no-loop-func
      promiseArr.push((async () => {
        // Add try/catch so that if one revoke fails
        // the others won't be canceled because of it
        try {
          logger.info(`Revoking membership for subscription with id ${subscription.id}`);

          await revokeMembership(subscription);

          logger.info(`Revoked membership ${subscription.id}`);
        } catch (e) {
          logger.warn('Error occurred while trying to revoke subscription', e);
        }
      })());
    }
  }

  await Promise.all(promiseArr);

  logger.info(`Memberships revoked successfully`);
};