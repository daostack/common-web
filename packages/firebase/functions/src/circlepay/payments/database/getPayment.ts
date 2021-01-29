import { ArgumentError, NotFoundError } from '../../../util/errors';

import { IPaymentEntity } from '../types';
import { PaymentsCollection } from './index';

/**
 * Gets payment by id
 *
 * @param paymentId - The ID of the payment, that you want to find. Please note
 *                that this is the local ID of the payment and not the one,
 *                provided by Circle
 *
 * @throws { ArgumentError } - If the paymentId param is with falsy value
 * @throws { NotFoundError } - If the payment is not found
 *
 * @returns - The found payment
 */
export const getPayment = async (paymentId: string, throwErr = true): Promise<IPaymentEntity> => {
  if (!paymentId) {
    throw new ArgumentError('paymentId', paymentId);
  }

  const payment = (await PaymentsCollection
    .doc(paymentId)
    .get()).data();

  if (!payment && throwErr) {
    throw new NotFoundError(paymentId, 'payment');
  }

  return payment;
};