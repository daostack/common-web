import admin from 'firebase-admin';

import { QuerySnapshot } from '@google-cloud/firestore';

import { Collections } from '../../util/constants';

import { chargeSubscription } from './chargeSubscription';
import { ISubscriptionEntity } from '../types';

import Timestamp = admin.firestore.Timestamp;
const db = admin.firestore();

/**
 *  Charges all subscriptions that are due today. Only
 *  to be used from the crons job!
 */
export const chargeSubscriptions = async (): Promise<void> => {
  logger.info(`Beginning subscription charging for ${new Date().getDate()}`);

  const subscriptionsDueToday = await db.collection(Collections.Subscriptions)
    // .where('dueDate', '>=', new Date().setHours(0,0,0,0))
    .where('dueDate', '<=', Timestamp.fromMillis(new Date().setHours(23, 59, 59, 999)))
    .where('status', 'in', ['Active', 'PaymentFailed'])
    .get() as QuerySnapshot<ISubscriptionEntity>;

  const promiseArr: Promise<any>[] = [];

  for (const subscriptionDueToday of subscriptionsDueToday.docs) {
    const subscriptionEntity = subscriptionDueToday.data() as ISubscriptionEntity;

    if (subscriptionEntity.status === 'PaymentFailed') {
      if (subscriptionEntity.paymentFailures.length > 3) {
        logger.warn(`
          Subscription (${subscriptionEntity.id}) with more than 
          3 failed payment was tried to be charged!
        `);

        continue;
      }
    }

    if (subscriptionEntity.status === 'Active' || subscriptionEntity.status === 'PaymentFailed') {
      // eslint-disable-next-line no-loop-func
      promiseArr.push((async () => {
        logger.info(`Charging subscription (${subscriptionEntity.id}) with $${subscriptionEntity.amount}`, {
          subscription: subscriptionEntity,
          date: new Date()
        });

        // Add try/catch so that if one charge fails
        // the others won't be canceled because of it
        try {
          await chargeSubscription(subscriptionEntity);

          // logger.info(`Charged subscription (${subscriptionEntity.id}) with $${subscriptionEntity.amount}`, {
          //   subscription: subscriptionEntity,
          //   date: new Date()
          // });
        } catch (e) {
          logger.warn('Error occurred while trying to charge subscription', {
            error: e
          });
        }
      })());
    } else {
      logger.error(`
        Subscription (${subscriptionEntity.id}) with unsupported 
        status (${subscriptionEntity.status}) was in the charge loop.
      `);
    }

  }

  await Promise.all(promiseArr);

  logger.info(`Subscriptions charged successfully`);

};