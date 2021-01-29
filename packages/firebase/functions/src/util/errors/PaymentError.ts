import { CommonError } from './CommonError';

/**
 * The exception that is thrown when something goes
 * wrong with the payment
 */
export class PaymentError extends CommonError {
  constructor(paymentId: string, circlePaymentId: string) {
    super('The payment failed', {
      paymentId,
      circlePaymentId
    });
  }
}