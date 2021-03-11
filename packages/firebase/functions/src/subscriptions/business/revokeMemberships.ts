import { ISubscriptionEntity } from '@common/types';
import { firestore } from 'firebase-admin';

import { Collections } from '../../util/constants';

import { CancellationReason } from './cancelSubscription';
import { revokeMembership } from './revokeMembership';

const db = firestore();

/**
 * Revokes all membership that are expired, but not yet revoked
 */
export const revokeMemberships = async (): Promise<void> => {
  logger.info(`Beginning membership revoking for ${ new Date().toDateString() }`);

  // Only get the subscription cancelled by user, because the subscriptions
  // canceled by payment failure should already be revoked
  const subscriptions = await db.collection(Collections.Subscriptions)
    .where('status', '==', CancellationReason.CanceledByUser)
    .where('revoked', '==', false)
    .get() as firestore.QuerySnapshot<ISubscriptionEntity>;

  for (const subscriptionSnap of subscriptions.docs) {
    const subscription = subscriptionSnap.data() as ISubscriptionEntity;

    if (subscription.status === 'Active' || subscription.status === 'PaymentFailed') {
      logger.warn(
        `
            Trying to revoke subscription with status 
            (${ subscription.status }) from the cron
          `
      );
    } else {
      // If the subscription is pass it's due date: revoke it, If is not leave it be
      if (subscription.dueDate.toDate() < new Date()) {
        // Add try/catch so that if one revoke fails
        // the others won't be canceled because of it
        try {
          logger.info(`Revoking membership for subscription with id ${ subscription.id }`);

          // eslint-disable-next-line no-await-in-loop
          await revokeMembership(subscription);

          logger.info(`Revoked membership ${ subscription.id }`);
        } catch (e) {
          logger.warn('Error occurred while trying to revoke subscription', e);
        }
      } else {
        logger.debug('Skipping revoke for user canceled subscription', {
          subscription
        });
      }
    }
  }

  logger.info(`Memberships revoked successfully`);
};