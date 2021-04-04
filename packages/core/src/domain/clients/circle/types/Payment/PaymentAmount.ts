import { CircleCurrency } from 'packages/core/src/domain/clients/circle/types/CircleCurrency';

export interface ICirclePaymentAmount {
  /**
   * The amount of the payment in selected currency
   * **NOT IN CENTS OF THE CURRENCY**
   */
  amount: number;

  /**
   * The currency of the payment
   */
  currency: CircleCurrency;
}