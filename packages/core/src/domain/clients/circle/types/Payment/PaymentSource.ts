export type PaymentSourceType = 'card';

export interface IPaymentSource {
  /**
   * The ID of the payment source
   */
  id: string;

  /**
   * The type of the payment source
   */
  type: PaymentSourceType;
}