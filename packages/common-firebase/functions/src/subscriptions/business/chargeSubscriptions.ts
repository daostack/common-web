import admin from 'firebase-admin';
import { QuerySnapshot } from '@google-cloud/firestore';

import { Collections } from '../../util/constants';
import { ISubscriptionEntity } from '../../util/types';
import { CommonError } from '../../util/errors';

import { chargeSubscription } from './chargeSubscription';

const db = admin.firestore();

/**
 *  Charges all subscriptions that are due today. Only
 *  to be used from the cron job!
 */
export const chargeSubscriptions = async (): Promise<void> => {
  console.info(`Beginning subscription charging for ${new Date().getDate()}`);

  const subscriptionsDueToday = await db.collection(Collections.Subscriptions)
    // .where('dueDate', '>=', new Date().setHours(0,0,0,0))
    .where('dueDate', '<=', new Date().setHours(23, 59, 59, 999))
    .where('status', 'in', ['Active', 'PaymentFailed'])
    .get() as QuerySnapshot<ISubscriptionEntity>;

  const promiseArr: Promise<any>[] = [];

  for (const subscriptionDueToday of subscriptionsDueToday.docs) {
    const subscriptionEntity = subscriptionDueToday.data() as ISubscriptionEntity;

    if (subscriptionEntity.status === 'PaymentFailed') {
      if (subscriptionEntity.paymentFailures.length > 3) {
        console.warn(`
          Subscription (${subscriptionEntity.id}) with more than 
          3 failed payment was tried to be charged!
        `);

        continue;
      }
    }

    if (subscriptionEntity.status === 'Active' || subscriptionEntity.status === 'PaymentFailed') {
      promiseArr.push((async () => {
        console.info(`Charging subscription (${subscriptionEntity.id}) with $${subscriptionEntity.amount}`);
        console.trace(`Charging subscription`, subscriptionEntity);

        // Add try/catch so that if one charge fails
        // the others won't be canceled because of it
        try {
          await chargeSubscription(subscriptionEntity);

          console.info(`Charged subscription (${subscriptionEntity.id}) with $${subscriptionEntity.amount}`);
          console.trace(`Charged subscription`, subscriptionEntity);
        } catch (e) {
          console.error('Error occurred while trying to charge subscription', e);
        }
      })());
    } else {
      console.error(new CommonError(`
        Subscription (${subscriptionEntity.id}) with unsupported 
        status (${subscriptionEntity.status}) was in the charge loop.
      `));
    }

  }

  await Promise.all(promiseArr);

  console.info(`Subscriptions charged successfully`);

};