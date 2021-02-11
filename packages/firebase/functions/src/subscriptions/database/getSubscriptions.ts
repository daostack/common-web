import { ISubscriptionEntity } from '@common/types';
import { SubscriptionsCollection } from './index';
import { firestore } from 'firebase-admin';

interface IGetSubscriptionsOptions {
  userId?: string;
}

/**
 * Returns all subscriptions matching the chosen options
 *
 * @param options - The options for filtering the subscriptions
 */
export const getSubscriptions = async (options: IGetSubscriptionsOptions): Promise<ISubscriptionEntity[]> => {
  let subscriptionsQuery: firestore.Query<ISubscriptionEntity> = SubscriptionsCollection;

  if(options.userId) {
    subscriptionsQuery = subscriptionsQuery.where('userId', '==', options.userId)
  }

  return (await subscriptionsQuery.get()).docs
    .map(bankAccount => bankAccount.data());
};

