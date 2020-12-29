import { IPaymentEntity } from '../types';
import { subscriptionDb } from '../../../subscriptions/database';
import { paymentDb } from '../database';

/**
 * Function for updating payments with object IDs to payment
 * with proposal and subscription IDs. Do not use if you have not
 * written this function
 *
 * @param payment - The outdated payment
 *
 * @returns - The updated payment or the passed payment if it was already updated
 */
export const convertObjectId = async (payment: IPaymentEntity): Promise<IPaymentEntity> => {
  const { objectId, ...updatedPayment } = payment as any;

  try {
    if (!objectId) {
      logger.info('Skipping payment update as it has no object ID', {
        payment
      });

      return payment;
    }

    if (updatedPayment.type === 'subscription') {
      const subscription = await subscriptionDb.get(objectId);

      updatedPayment.subscriptionId = subscription.id;
      updatedPayment.proposalId = subscription.proposalId;
    } else {
      updatedPayment.proposalId = objectId;
    }

    return paymentDb.update(updatedPayment);
  } catch (e) {
    logger.notice('Unable to update payment', {
      payment,
      error: e
    });

    return payment;
  }
};

export const updatePayments = async (): Promise<void> => {
  const payments = await paymentDb.getMany({});
  const promiseArr: Promise<IPaymentEntity>[] = [];

  payments.forEach(payment => {
    if(payment.createdAt) {
      promiseArr.push(convertObjectId(payment));
    }
  });

  await Promise.all(promiseArr);
};