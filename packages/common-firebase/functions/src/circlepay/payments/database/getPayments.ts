import { IPaymentEntity, PaymentStatus } from '../types';
import { PaymentsCollection } from './index';

interface IGetPaymentsOptions {
  /**
   * Get all payments with ID (should be only one)
   */
  id?: string;

  /**
   * Filter so only payments for subscription
   * fill be returned
   */
  subscriptionId?: string;

  /**
   * Filter by the status of the payment
   */
  status?: PaymentStatus;

  createdFromObject?: {
    id?: string;
  }
}

/**
 * Returns all payments matching the chosen options
 *
 * @param options - The options for filtering the payments
 */
export const getPayments = async (options: IGetPaymentsOptions): Promise<IPaymentEntity[]> => {
  let paymentsQuery: any = PaymentsCollection;

  if (options.id) {
    paymentsQuery = paymentsQuery.where('id', '==', options.id);
  }

  if (options.subscriptionId) {
    paymentsQuery = paymentsQuery
      .where('type', '==', 'subscription')
      .where('subscription.id', '==', options.subscriptionId);
  }

  if (options.status) {
    paymentsQuery = paymentsQuery
      .where('status', '==', options.status);
  }

  if (options.createdFromObject) {
    const { createdFromObject } = options;

    if (createdFromObject.id) {
      paymentsQuery = paymentsQuery.where('createdFromObject.id', '==', createdFromObject.id);
    }
  }

  return (await paymentsQuery.get()).docs
    .map(payment => payment.data()) || [];
};
