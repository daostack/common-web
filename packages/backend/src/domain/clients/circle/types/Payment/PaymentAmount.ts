export interface ICirclePaymentAmount {
  /**
   * The amount of the payment in selected currency
   * **NOT IN CENTS OF THE CURRENCY**
   */
  amount: number;

  /**
   * The currency of the payment
   */
  currency: string;
}