export type PaymentSourceType = 'card';

export interface IPaymentSource {
  /**
   * The ID of the payment source
   */
  id: string;

  /**
   * The Types of the payment source
   */
  type: PaymentSourceType;
}