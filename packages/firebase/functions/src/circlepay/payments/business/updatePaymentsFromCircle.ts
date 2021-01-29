import { getPayments, IGetPaymentsOptions } from '../database/getPayments';
import { updatePaymentFromCircle } from './updatePaymentFromCircle';
import { paymentDb } from '../database';

const defaultGetPaymentOptions: IGetPaymentsOptions = {
  status: 'pending',
  olderThan: new Date((new Date().getTime()) - 60 * 60 * 1000) // 1 hour before now
};

/**
 * Update all payments that match the passed option from circle and acts upon
 * the status changes
 *
 * @param trackId - Required. Id used for identifying the update batch
 * @param options - Optional. Sorting and filtering options for getting
 *    the payments. If not provided only pending payments will be updated
 */
export const updatePaymentsFromCircle = async (
  trackId: string,
  options: IGetPaymentsOptions = defaultGetPaymentOptions
): Promise<void> => {
  const payments = await getPayments(options);
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