import { paymentDb } from '../database';
import { IPaymentEntity } from '../types';

import { subscriptionDb } from '../../../subscriptions/database';
import { proposalDb } from '../../../proposals/database';

import firebase from 'firebase-admin';
import Timestamp = firebase.firestore.Timestamp;

/**
 * Function for updating payments with object IDs to payment
 * with proposal and subscription IDs. Do not use if you have not
 * written this function
 *
 * @param payment - The outdated payment
 *
 * @returns - The updated payment or the passed payment if it was already updated
 */
const convertObjectId = async (payment: IPaymentEntity): Promise<IPaymentEntity> => {
  const { objectId, ...updatedPayment } = payment as any;

  try {
    if (!objectId) {
      logger.info('Skipping payment update as it has no object ID', {
        payment
      });

      return payment;
    }

    if (updatedPayment.type === 'subscription') {
      try {
        const subscription = await subscriptionDb.get(objectId);

        updatedPayment.subscriptionId = subscription.id;
        updatedPayment.proposalId = subscription.proposalId;
      } catch (e) {
        if (e.errorCode !== 'NotFound') {
          throw e;
        }

        updatedPayment.subscriptionId = 'Payment for deleted subscription';
        updatedPayment.proposalId = 'Payment for deleted subscription';
      }
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const convertOlderPaymentFormat = async (payment: any): Promise<IPaymentEntity> => {
  //  If the payment is not of the type we need it to be
  if (!payment.updateDate) {
    return null;
  }

  const subscription = payment.type === 'SubscriptionPayment'
    ? await subscriptionDb.get(payment.subscriptionId)
    : null;

  const proposal = payment.type !== 'SubscriptionPayment'
    ? await proposalDb.getProposal(payment.proposalId)
    : null;

  const paymentObj: IPaymentEntity = {
    id: payment.id,
    circlePaymentId: payment.id,

    amount: {
      amount: Number(payment.amount.amount),
      currency: 'USD'
    },

    source: {
      id: payment.source.id,
      type: 'card'
    },

    type: payment.type === 'SubscriptionPayment'
      ? 'subscription'
      : 'one-time',

    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),

    status: payment.status,

    userId: proposal?.proposerId || subscription.userId,
    proposalId: payment.proposalId || subscription.proposalId,

    fees: null as any,

    ...(payment.type === 'SubscriptionPayment' && {
      subscriptionId: subscription.id
    })
  };

  paymentObj['createdFromObject'] = payment;

  logger.debug('Deleting older payment and replacing it with payment of the new format', {
    oldPayment: payment,
    newPayment: paymentObj
  });

  return await paymentDb.update(paymentObj, {
    useSet: true
  });
};

export const updatePaymentStructure = async (payment: IPaymentEntity | any): Promise<IPaymentEntity> => {
  if (payment.creationDate) {
    return convertOlderPaymentFormat(payment);
  } else if (payment.createdAt && payment.objectId) {
    return convertObjectId(payment);
  } else {
    logger.info('Skipping payment update', {
      payment
    });

    return null;
  }
};

export const updatePayments = async (): Promise<void> => {
  const payments = await paymentDb.getMany({});
  const promiseArr: Promise<IPaymentEntity>[] = [];

  payments.forEach(payment => promiseArr.push(updatePaymentStructure(payment)));

  await Promise.all(promiseArr.map(p => p.catch(e => {
    logger.info('Error occurred while updating payment', {
      error: e
    });
  })));
};