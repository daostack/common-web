import { db } from '../../../util';
import { Collections } from '../../../constants';

import { IPaymentEntity } from '@common/types';
import { addPayment } from './addPayment';
import { updatePaymentInDatabase } from './updatePayment';
import { getPayments } from './getPayments';
import { getPayment } from './getPayment';
import { deletePayment } from './deletePayment';

export const PaymentsCollection = db.collection(Collections.Payments)
  .withConverter<IPaymentEntity>({
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): IPaymentEntity {
      return snapshot.data() as IPaymentEntity;
    },

    toFirestore(object: IPaymentEntity | Partial<IPaymentEntity>): FirebaseFirestore.DocumentData {
      return object;
    }
  });

export const paymentDb = {
  /**
   * Get exactly one payment from the firestore
   * by the payment's document ID. Throws NotFound
   * if not found
   */
  get: getPayment,

  /**
   * Get array of payments by choosing some
   * options. The payment in the returned array are matching
   * all requirements
   */
  getMany: getPayments,

  /**
   * Save a payment to the database
   */
  add: addPayment,

  /**
   * Update existing payment in the database
   */
  update: updatePaymentInDatabase,

  /**
   * Delete payment from the payments collection and
   * created deleted entity for it
   */
  delete: deletePayment
};