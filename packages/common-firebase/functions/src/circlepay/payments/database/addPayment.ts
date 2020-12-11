import { v4 } from 'uuid';
import admin from 'firebase-admin';
import Timestamp = admin.firestore.Timestamp;

import { BaseEntityType, SharedOmit } from '../../../util/types';

import { IPaymentEntity } from '../types';
import { PaymentsCollection } from './index';


/**
 * Prepares the passed payment for saving and saves it. Please note that
 * there is *no* validation being done here. *Do not use directly!*
 *
 * @param payment - the payment to be saved
 */
export const addPayment = async (payment: SharedOmit<IPaymentEntity, BaseEntityType>): Promise<IPaymentEntity> => {
  const paymentDoc: IPaymentEntity = {
    id: v4(),

    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),

    ...payment
  };

  if (process.env.NODE_ENV === 'test') {
    paymentDoc['testCreated'] = true;
  }

  await PaymentsCollection
    .doc(paymentDoc.id)
    .set(paymentDoc);

  return paymentDoc;
};