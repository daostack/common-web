import { IBaseEntity } from '../../util/types';

export type PaymentType = 'one-time' | 'subscription';
export type PaymentStatus = 'pending' | 'confirmed' | 'paid' | 'failed';
export type PaymentSource = 'card';
export type PaymentCurrency = 'USD';

interface IPaymentEntityBase extends IBaseEntity {
  /**
   * Whether the payment was one-time payment or result of
   * a subscription
   */
  type: PaymentType;

  /**
   * The current status of the payment
   */
  status: PaymentStatus;

  /**
   * The amount and currency of the payment
   */
  amount: IPaymentAmount;

  /**
   * The amount and currency of the payment fees
   */
  fees: IPaymentFees;

  /**
   * The source of the payment
   */
  source: IPaymentSource;

  /**
   * The ID of the object, for which the payment was created
   */
  objectId: string;

  /**
   * The ID of the user that was charged. Useful for retrieving all
   * payments of one user
   */
  userId: string;

  /**
   * The ID of the payment on circle side
   */
  circlePaymentId: string;
}

export interface IPaymentAmount {
  /**
   * The amount in cents of the currency
   */
  amount: number;

  /**
   * The currency of the payment
   */
  currency: PaymentCurrency;
}

export interface IPaymentFees {
  /**
   * The amount of the fee in cents of the currency
   */
  amount: number;

  /**
   * The currency of the payment
   */
  currency: PaymentCurrency;
}

export interface IPaymentSource {
  /**
   * The id of the payment source
   */
  id: string;

  /**
   * The type of the payment source
   */
  type: PaymentSource;
}

// Exports and unions

export interface ISubscriptionPayment extends IPaymentEntityBase {
  type: 'subscription';
}

export interface IProposalPayment extends IPaymentEntityBase {
  type: 'one-time';
}


export type IPaymentEntity = IPaymentEntityBase //ISubscriptionPayment | IProposalPayment;