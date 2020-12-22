import { ICirclePayment } from '../../types';

import { IPaymentFailureReason, PaymentFailureResponseCodes } from '../types';

const failureCodeDescription: {
  [key in PaymentFailureResponseCodes]: string;
} = {
  card_account_ineligible: 'Ineligible account associated with card',
  card_invalid: 'Invalid card number',
  card_limit_violated: 'Exceeded amount or frequency limits',
  card_not_honored: 'Contact card issuer to query why payment failed',
  credit_card_not_allowed: 'Issuer did not support using a credit card for payment',
  payment_denied: 'Payment denied by Circle Risk Service or card processor risk controls',
  payment_failed: 'Payment failed due to unspecified error',
  payment_fraud_detected: 'Payment suspected of being associated with fraud',
  payment_not_funded: 'Insufficient funds in account to fund payment',
  payment_not_supported_by_issuer: 'Issuer did not support the payment',
  payment_stopped_by_issuer: 'A stop has been placed on the payment or card'

};

const getFailureDescription = (responseCode: PaymentFailureResponseCodes = 'payment_failed'): string =>
  failureCodeDescription[responseCode];

export const processFailedPayment = (payment: ICirclePayment): IPaymentFailureReason => {
  if (payment.data.status !== 'failed') {
    logger.warn('Trying to process failed payment that is not actually failed', {
      payment
    });

    return null;
  }

  const failureReason: IPaymentFailureReason = {
    errorCode: payment.data.errorCode || 'payment_failed',
    errorDescription: getFailureDescription(payment.data.errorCode)
  };

  logger.debug(`Processed failure reason for payment}`, {
    failureReasonFromCircle: payment.data.errorCode,
    processedFailureReason: failureReason,
    payment
  });

  return failureReason;
};

export const failureHelper = {
  processFailedPayment
};