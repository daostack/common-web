import { getPayments } from '../database/getPayments';
import { updatePaymentFromCircle } from './updatePaymentFromCircle';

export const updatePaymentsFromCircle = async (): Promise<void> => {
  const payments = await getPayments({});
  const paymentUpdatePromiseArr: Promise<any>[] = [];

  payments.forEach(payment => {
    if (payment.createdAt) {
      paymentUpdatePromiseArr.push(updatePaymentFromCircle(payment.id));
    } else {
      logger.debug('Skipping update on older type payment.', {
        payment
      });
    }
  });

  await Promise.all(paymentUpdatePromiseArr);

  logger.info('Successfully updated all payments');
};