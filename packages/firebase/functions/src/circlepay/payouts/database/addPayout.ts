import { v4 } from 'uuid';
import admin from 'firebase-admin';
import Timestamp = admin.firestore.Timestamp;

import { BaseEntityType, SharedOmit } from '../../../util/types';

import { IPayoutEntity } from '../types';
import { PayoutsCollection } from './index';

/**
 * Prepares the passed payout for saving and saves it. Please note that
 * there is *no* validation being done here. *Do not use directly!*
 *
 * @param payout - the payout to be saved
 */
export const addPayout = async (payout: SharedOmit<IPayoutEntity, BaseEntityType>): Promise<IPayoutEntity> => {
  const payoutDoc: IPayoutEntity = {
    id: v4(),

    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),

    ...payout
  };

  if (process.env.NODE_ENV === 'test') {
    payoutDoc['testCreated'] = true;
  }

  await PayoutsCollection
    .doc(payoutDoc.id)
    .set(payoutDoc);

  return payoutDoc;
};