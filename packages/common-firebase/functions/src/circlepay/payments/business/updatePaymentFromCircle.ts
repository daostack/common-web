import { circleClient } from '../../circleClient';

import { IPaymentEntity } from '../types';
import { isFinalized } from '../helpers';
import { paymentDb } from '../database';

import { updatePayment } from './updatePayment';
import { ArgumentError } from '../../../util/errors';

interface IUpdatePaymentFromCircleOptions {
  /**
   * Skip updating the payment info if the current status
   * of the payment in the FireStore is one of the final
   * payment states (failed, paid)
   */
  skipIfFinalized: boolean;
}

const defaultOptions: IUpdatePaymentFromCircleOptions = {
  skipIfFinalized: false
};

/**
 * Update payment to be the latest possible version from circle
 *
 * @param paymentId - The payment ID as is in the FireStore
 * @param customOptions - Options to change the updating behaviour
 *
 * @returns - The updated payment entity
 */
export const updatePaymentFromCircle = async (paymentId: string, customOptions?: Partial<IUpdatePaymentFromCircleOptions>): Promise<IPaymentEntity> => {
  // Verify the required arguments
  if (typeof paymentId !== 'string') {
    throw new ArgumentError('paymentId', paymentId);
  }

  // Create the final options
  const options = {
    ...defaultOptions,
    ...customOptions
  };

  // Find the payment in the database
  const payment = await paymentDb.get(paymentId);

  // If the payment is in final state and options
  // says to not update finalized payments return
  if (isFinalized(payment) && options.skipIfFinalized) {
    return payment;
  }

  // Get the current payment from circle
  const circlePayment = await circleClient.getPayment(payment.circlePaymentId);

  // Update the payment and return it
  return updatePayment(payment, circlePayment);
};