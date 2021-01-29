import { firestore } from 'firebase-admin';

import { IPaymentEntity } from '../types';
import { PaymentsCollection } from './index';

interface IUpdatePaymentOptions {
  useSet: boolean;
}

/**
 * Updates the payment in the backing store
 *
 * @param payment - The updated payment
 * @param options - Options object, modifying the set behaviour
 */
export const updatePaymentInDatabase = async (payment: IPaymentEntity, options: Partial<IUpdatePaymentOptions> = {}): Promise<IPaymentEntity> => {
  const paymentDoc = {
    ...payment,

    updatedAt: firestore.Timestamp.now()
  };

  if (options.useSet) {
    await PaymentsCollection
      .doc(paymentDoc.id)
      .set(paymentDoc);
  } else {
    await PaymentsCollection
      .doc(paymentDoc.id)
      .update(paymentDoc);
  }

  logger.info('Updating payment', {
    updatedPayment: paymentDoc,
    updatedAt: paymentDoc.updatedAt,
    previousUpdateAt: payment.updatedAt
  });

  return paymentDoc;
};