import { getSubscription } from './getSubscription';
import { updateSubscription } from './updateSubscription';
import { db } from '../../util';
import { Collections } from '../../constants';
import { addSubscription } from './addSubscription';
import { subscriptionExists } from './subscriptionExists';

export const subscriptionsCollection = db.collection(Collections.Subscriptions);

export const subscriptionDb = {
  add: addSubscription,
  get: getSubscription,
  update: updateSubscription,
  exists: subscriptionExists
};