import { firestore } from 'firebase-admin';

import { IPaymentEntity } from './../types';
import { PaymentsCollection } from './index';

/**
 * Updates the payment in the backing store
 *
 * @param payment - The updated payment
 */
export const updatePaymentInDatabase = async (payment: IPaymentEntity): Promise<IPaymentEntity> => {
  const paymentDoc = {
    ...payment,

    updatedAt: firestore.Timestamp.now()
  };

  await PaymentsCollection
    .doc(paymentDoc.id)
    .update(paymentDoc);

  return paymentDoc;
};