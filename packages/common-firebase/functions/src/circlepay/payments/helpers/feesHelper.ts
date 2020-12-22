import { ICirclePayment } from '../../types';
import { IPaymentFees } from '../types';

const defaultFees: IPaymentFees = {
  amount: 0,
  currency: 'USD'
};

export const processCircleFee = (circlePayment: ICirclePayment): IPaymentFees => {
  const { data: payment } = circlePayment;

  if (!payment.fees) {
    logger.warn('Trying to process payment fees, but there is no fees object on the payment', {
      payment
    });

    return defaultFees;
  }

  const fees: IPaymentFees = {
    // Circle returns the fees in dollars. Convert it to cents,
    amount: Number(payment.fees.amount) * 100,
    currency: payment.fees.currency
  };

  logger.debug('Converted circle fees', {
    circleFees: payment.fees,
    convertedFees: fees,
    circlePaymentId: circlePayment.data.id
  });

  return fees;
};

export const feesHelper = {
  processCircleFee
}