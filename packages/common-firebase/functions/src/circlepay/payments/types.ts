import { IBaseEntity, Nullable } from '../../util/types';

export type PaymentType = 'one-time' | 'subscription';
export type PaymentStatus = 'pending' | 'confirmed' | 'paid' | 'failed';
export type PaymentSource = 'card';
export type PaymentCurrency = 'USD';

export type PaymentFailureResponseCodes =
  'payment_failed' |
  'card_not_honored' |
  'payment_not_supported_by_issuer' |
  'payment_not_funded' |
  'card_invalid' |
  'card_limit_violated' |
  'payment_denied' |
  'payment_fraud_detected' |
  'credit_card_not_allowed' |
  'payment_stopped_by_issuer' |
  'card_account_ineligible';

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
   * The ID of the proposal, for which the payment was created
   */
  proposalId: string;

  /**
   * The ID of the subscription, for which the payment was created
   * if created for subscription. Undefined otherwise
   */
  subscriptionId?: Nullable<string>;

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

export interface IPaymentFailureReason {
  /**
   * The error code, returned from Circle
   */
  errorCode: PaymentFailureResponseCodes;

  /**
   * Short description about why the payment failure, taken
   * from the Circle documentation. Can be shown to the user
   */
  errorDescription: string;
}

// Payment divided by their type

export interface IPendingPayment extends IPaymentEntityBase {
  status: 'pending';
}

export interface IFailedPayment extends IPaymentEntityBase {
  status: 'failed';

  failure: IPaymentFailureReason;
}

export interface IConfirmedPayment extends IPaymentEntityBase {
  status: 'confirmed';
}

export interface IPaidPayment extends IPaymentEntityBase {
  status: 'paid';
}


export type IPaymentEntity = IPaymentEntityBase | IPendingPayment | IConfirmedPayment | IPaidPayment | IFailedPayment;