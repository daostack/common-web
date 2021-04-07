import { CircleCurrency } from '..';

export interface IPaymentFee {
  /**
   * The amount of the fee in dollars
   */
  amount: string;

  /**
   * The currency of the payment (only USD)
   */
  currency: CircleCurrency;
}