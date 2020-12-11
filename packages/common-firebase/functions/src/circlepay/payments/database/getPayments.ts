import { IPaymentEntity, PaymentStatus } from '../types';
import { PaymentsCollection } from './index';

interface IGetCardOptions {
  /**
   * Filter so only payments for subscription
   * fill be returned
   */
  subscriptionId?: string;

  /**
   * Filter by the status of the payment
   */
  status?: PaymentStatus;
}

/**
 * Returns all payments matching the chosen options
 *
 * @param options - The options for filtering the payments
 */
export const getPayments = async (options: IGetCardOptions): Promise<IPaymentEntity[]> => {
  const paymentsQuery: any = PaymentsCollection;

  if (options.subscriptionId) {
    paymentsQuery
      .where('type', '==', 'subscription')
      .where('subscription.id', '==', options.subscriptionId);
  }

  if (options.status) {
    paymentsQuery
      .where('status', '==', options.status);
  }

  return (await paymentsQuery.get()).docs
    .map(payment => payment.data()) || [];
};
