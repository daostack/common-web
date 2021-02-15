import { getSubscription } from './getSubscription';
import { updateSubscription } from './updateSubscription';
import { db } from '../../util';
import { Collections } from '../../constants';
import { addSubscription } from './addSubscription';
import { subscriptionExists } from './subscriptionExists';
import { deleteSubscription } from './deleteSubscription';
import { ISubscriptionEntity } from '@common/types';
import { getSubscriptions } from './getSubscriptions';

export const SubscriptionsCollection = db.collection(Collections.Subscriptions)
  .withConverter<ISubscriptionEntity>({
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): ISubscriptionEntity {
      return snapshot.data() as ISubscriptionEntity;
    },
    toFirestore(object: ISubscriptionEntity | Partial<ISubscriptionEntity>): FirebaseFirestore.DocumentData {
      return object;
    },
  });

export const subscriptionDb = {
  add: addSubscription,
  get: getSubscription,
  getMany: getSubscriptions,
  update: updateSubscription,
  exists: subscriptionExists,
  delete: deleteSubscription,
};