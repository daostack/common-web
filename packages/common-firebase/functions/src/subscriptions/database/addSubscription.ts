import admin from 'firebase-admin';
import Timestamp = admin.firestore.Timestamp;
import { v4 } from 'uuid';

import { BaseEntityType, SharedOmit } from '../../util/types';

import { ISubscriptionEntity } from '../types';
import { SubscriptionsCollection } from './index';


/**
 * Prepares the passed subscription for saving and saves it. Please note that
 * there is *no* validation being done here
 *
 * @param subscription - the subscription to be saves
 */
export const addSubscription = async (subscription: SharedOmit<ISubscriptionEntity, BaseEntityType>): Promise<ISubscriptionEntity> => {
  const subscriptionDoc: ISubscriptionEntity = {
    id: v4(),

    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),

    charges: 0,

    ...(subscription as ISubscriptionEntity)
  };

  if(process.env.NODE_ENV === 'test') {
    subscriptionDoc['testCreated'] = true;
  }

  await SubscriptionsCollection
    .doc(subscriptionDoc.id)
    .set(subscriptionDoc);

  return subscriptionDoc;
};