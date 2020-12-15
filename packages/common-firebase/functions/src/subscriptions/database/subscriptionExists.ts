import admin from 'firebase-admin';
import { ISubscriptionEntity } from '../types';
import { SubscriptionsCollection } from './index';


import DocumentSnapshot = admin.firestore.DocumentSnapshot;

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
  let subscription: DocumentSnapshot<ISubscriptionEntity>;

  if (args.id) {
    subscription = (await SubscriptionsCollection.doc(args.id).get()) as DocumentSnapshot<ISubscriptionEntity>;
  }

  if (args.proposalId) {
    const where = await SubscriptionsCollection.where('proposalId', '==', args.proposalId).get();

    if (where.empty) {
      return false;
    } else {
      return true;
    }
  }

  return subscription ? subscription.exists : false;
};