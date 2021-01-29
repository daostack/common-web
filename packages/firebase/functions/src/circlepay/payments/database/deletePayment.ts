import { v4 } from 'uuid';

import { deletedDb } from '../../../util/deleted/database';
import { IDeletedEntity } from '../../../util/deleted/types';

import { IPaymentEntity } from '../types';

import { getPayment } from './getPayment';
import { PaymentsCollection } from './index';


/**
 * Deletes payment from the collection. If deleting multiple you
 * must pass deletionId as it will allow you to tract the deleted entities
 *
 * @param paymentId - The ID of the payment you want to delete
 * @param deletionId - THe tracker for the deletion
 */
export const deletePayment = async (paymentId: string, deletionId = v4()): Promise<IDeletedEntity<IPaymentEntity>> => {
  const latestPaymentSnapshot = await getPayment(paymentId, false);

  if (!latestPaymentSnapshot) {
    logger.notice(`Cannot delete payment with ID ${paymentId} cause it does not exist`);

    return null;
  }

  logger.notice(`Deleting payment with ID ${paymentId}`, {
    snapshot: latestPaymentSnapshot
  });

  // Delete the payment
  await PaymentsCollection.doc(paymentId).delete();

  logger.debug('Payment was successfully deleted. Creating deleted entity', {
    payment: latestPaymentSnapshot
  });

  // Save the deleted entity
  return deletedDb.add<IPaymentEntity>(latestPaymentSnapshot, deletionId);
};