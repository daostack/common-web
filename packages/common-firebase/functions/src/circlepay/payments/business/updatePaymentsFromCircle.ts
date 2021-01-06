import { getPayments } from '../database/getPayments';
import { updatePaymentFromCircle } from './updatePaymentFromCircle';
import { paymentDb } from '../database';

export const updatePaymentsFromCircle = async (trackId: string): Promise<void> => {
  const payments = await getPayments({});
  const paymentUpdatePromiseArr: Promise<any>[] = [];

  payments.forEach(payment => {
    if (payment.createdAt) {
      paymentUpdatePromiseArr.push((async () => {
        try {
          await updatePaymentFromCircle(payment.id, trackId);
        } catch (e) {
          logger.warn('Unable to update payment from circle because error occurred trying to do so', {
            payment,
            error: e
          });

          payment['updateFailed'] = true;

          try {
            payment['updateFailedData'] = {
              message: e.message,
              response: JSON.parse(e.data?.response)
            };
          } catch (ex) {
            payment['updateFailedData'] = {
              message: ex.message,
              response: ex.data?.response
            };
          }

          await paymentDb.update(payment);
        }
      })());
    } else {
      logger.debug('Skipping update on older type payment.', {
        payment
      });
    }
  });

  await Promise.all(paymentUpdatePromiseArr);

  logger.info('Successfully updated all payments');
};