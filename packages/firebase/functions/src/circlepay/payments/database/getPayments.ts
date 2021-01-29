import admin from 'firebase-admin';

import { IPaymentEntity, PaymentStatus } from '../types';
import { PaymentsCollection } from './index';
import Query = admin.firestore.Query;

export interface IGetPaymentsOptions {
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
  status?: PaymentStatus | PaymentStatus[];

  /**
   * Get payment that were created before
   * the passed date
   */
  olderThan?: Date;

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
  let paymentsQuery: Query<IPaymentEntity> = PaymentsCollection;

  if (options.id) {
    paymentsQuery = paymentsQuery.where('id', '==', options.id);
  }

  if (options.subscriptionId) {
    paymentsQuery = paymentsQuery
      .where('type', '==', 'subscription')
      .where('subscription.id', '==', options.subscriptionId);
  }

  if (options.status) {
    paymentsQuery = Array.isArray(options.status)
      ? paymentsQuery.where('status', 'in', options.status)
      : paymentsQuery.where('status', '==', options.status);
  }

  if (options.createdFromObject) {
    const { createdFromObject } = options;

    if (createdFromObject.id) {
      paymentsQuery = paymentsQuery.where('createdFromObject.id', '==', createdFromObject.id);
    }
  }

  if (options.olderThan) {
    paymentsQuery = paymentsQuery
      .orderBy('createdAt')
      .where('createdAt', '<', options.olderThan);
  }

  return (await paymentsQuery.get()).docs
    .map(payment => payment.data()) || [];
};
