import admin from 'firebase-admin';
import Timestamp = admin.firestore.Timestamp;

import { CirclePaymentStatus, IBaseEntity } from '../util/types';

export interface ISubscriptionEntity extends IBaseEntity {
  /**
   * Link to the current funding card
   */
  cardId: string;

  /**
   * The Id of the user, from whom the subscription was
   * created
   */
  userId: string;

  /**
   * The id of the proposal, from witch the subscription
   * was created
   */
  proposalId: string;

  /**
   * List of all payment made for that subscription
   */
  payments: ISubscriptionPayment[];

  /**
   * When the next payment is going to be created
   */
  dueDate: Timestamp;

  /**
   * The currents status of the subscription
   */
  status: SubscriptionStatus;

  /**
   * The amount, that we are going to charge monthly
   */
  amount: number;

  /**
   * Some metadata related to the subscription (for example data about the common)
   */
  metadata: ISubscriptionMetadata;

  /**
   * List of the failed payment only for the current due payment
   */
  paymentFailures?: ISubscriptionPayment[];

  /**
   * Whether the membership for the user in the common was revoked
   */
  revoked: boolean;
}

export interface ISubscriptionPayment {
  /**
   * The id of the payment in the payments collection
   */
  paymentId: string;

  /**
   * The current status of the payment
   */
  paymentStatus: CirclePaymentStatus;
}

export interface ISubscriptionPaymentFailure {
  /**
   * The id of the payment in the payments collection
   */
  paymentId: string;

  /**
   * When did the payment failure occur
   */
  paymentFailedOn: Timestamp;
}

export interface ISubscriptionMetadata {
  /**
   * The common that the subscription grants membership to
   */
  common: {
    name: string;
    id: string;
  }
}

/**
 * Active - The subscription is still active and will be charge on due date
 *
 * PaymentFailed - The subscription is still active, but the payment for this due date failed. It will be
 * retried couple of times and if not successful the membership will be revoked
 *
 * CanceledByPaymentFailure - The subscription is not active, because the payment failed multiple times.
 * Membership is revoked
 *
 * CanceledByUser - The subscription is not active, because the user has canceled it. The membership may
 * still be active, but it will be revoked on the next due date
 */
export type SubscriptionStatus = 'Active' | 'CanceledByUser' | 'CanceledByPaymentFailure' | 'PaymentFailed';