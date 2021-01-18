import { v4 } from 'uuid';
import admin from 'firebase-admin';
import Timestamp = admin.firestore.Timestamp;


import { ICircleBalanceBase } from '../types';
import { CircleBalancesCollection } from '.';
import { getCircleBalance } from './getCircleBalance';



/**
 * Prepares the passed balance for saving and saves it. Please note that
 * there is *no* validation being done here. *Do not use directly!*
 *
 * @param balance - the balance to be saved
 */
export const addCircleBalance = async (): Promise<any> => {
  const balanceData = (await getCircleBalance()).data.data;

  const circleBalanceDoc: ICircleBalanceBase = {
    id: v4(),
    createdAt: Timestamp.now(),
    ...balanceData
  };

  

  await CircleBalancesCollection
    .doc(circleBalanceDoc.id)
    .set(circleBalanceDoc);

  return circleBalanceDoc;

};