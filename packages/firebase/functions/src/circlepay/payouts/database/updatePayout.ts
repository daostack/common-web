import { firestore } from 'firebase-admin';

import { IPayoutEntity } from './../types';
import { PayoutsCollection } from './index';

/**
 * Updates the payout in the backing store
 *
 * @param payout - The updated payout
 */
export const updatePayout = async (payout: IPayoutEntity): Promise<IPayoutEntity> => {
  const payoutDoc = {
    ...payout,

    updatedAt: firestore.Timestamp.now()
  };

  await PayoutsCollection
    .doc(payoutDoc.id)
    .update(payoutDoc);

  return payoutDoc;
};