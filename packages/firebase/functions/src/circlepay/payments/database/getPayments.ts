import admin from 'firebase-admin';

import { IPaymentEntity, PaymentStatus } from '@common/types';
import { PaymentsCollection } from './index';
import Query = admin.firestore.Query;
import { CommonError } from '../../../util/errors';

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

  /**
   * Get the last {number} of elements sorted
   * by createdAt date
   */
  last?: number;

  /**
   * Get the first {number} of elements sorted
   * by createdAt date
   */
  first?: number;

  /**
   * If sorting skip {number} elements
   */
  after?: number;
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

  // Sorting and paging
  if (options.first || options.last) {
    const { first, last, after } = options;

    if (first && last) {
      throw new CommonError('Only first or only last can be selected, not both!');
    }

    if (first) {
      paymentsQuery = paymentsQuery
        .orderBy('createdAt', 'asc')
        .limit(first);
    }

    if (last) {
      paymentsQuery = paymentsQuery
        .orderBy('createdAt', 'desc')
        .limit(last);
    }

    if (after) {
      paymentsQuery = paymentsQuery
        .offset(after);
    }
  }


  return (await paymentsQuery.get()).docs
    .map(payment => payment.data()) || [];
};
