import { ISubscriptionEntity } from '@common/types';
import { firestore } from 'firebase-admin';

import { SubscriptionsCollection } from './index';

interface ISubscriptionExistsArgs {
  id?: string;
  proposalId?: string;
}

/**
 * Checks if subscription exists by one of the
 * subscriptions unique properties
 *
 * @param args - Arguments against we will check
 */
export const subscriptionExists = async (args: ISubscriptionExistsArgs): Promise<boolean> => {
  let subscription: firestore.DocumentSnapshot<ISubscriptionEntity>;

  if (args.id) {
    subscription = (await SubscriptionsCollection.doc(args.id).get()) as firestore.DocumentSnapshot<ISubscriptionEntity>;
  }

  if (args.proposalId) {
    return !(await SubscriptionsCollection.where('proposalId', '==', args.proposalId).get()).empty;
  }

  return subscription ? subscription.exists : false;
};