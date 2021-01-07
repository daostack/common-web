import { v4 } from 'uuid';

import { paymentDb } from '../database';
import { IPaymentEntity } from '../types';

import { subscriptionDb } from '../../../subscriptions/database';
import { proposalDb } from '../../../proposals/database';

import firebase from 'firebase-admin';
import Timestamp = firebase.firestore.Timestamp;
import { getPayments } from '../database/getPayments';
import { catchError } from 'rxjs/operators';

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

    return paymentDb.update(updatedPayment, {
      useSet: true
    });
  } catch (e) {
    logger.notice('Unable to update payment', {
      payment,
      error: e
    });

    return payment;
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const convertOlderPaymentFormat = async (payment: any, trackId: string): Promise<IPaymentEntity> => {
  //  If the payment is not of the type we need it to be
  if (!payment.updateDate) {
    return null;
  }

  const subscription = payment.type === 'SubscriptionPayment'
    ? await subscriptionDb.get(payment.subscriptionId, false)
    : null;

  const proposal = payment.type !== 'SubscriptionPayment'
    ? await proposalDb.getProposal(payment.proposalId, false)
    : await proposalDb.getProposal(subscription.proposalId, false);


  const paymentObj: IPaymentEntity = {
    id: v4(),
    circlePaymentId: payment.id,

    amount: {
      amount: Number(payment.amount.amount) * 100,
      currency: 'USD'
    },

    source: {
      id: payment.source.id,
      type: 'card'
    },

    type: payment.type === 'SubscriptionPayment'
      ? 'subscription'
      : 'one-time',

    createdAt: Timestamp.fromDate(
      new Date(payment.creationDate)
    ),
    updatedAt: Timestamp.now(),

    status: payment.status,

    userId: proposal?.proposerId || subscription?.userId || 'manual work needed',
    proposalId: payment?.proposalId || subscription?.proposalId || 'manual work needed',

    fees: null as any,

    ...(payment.type === 'SubscriptionPayment' && {
      subscriptionId: subscription?.id || 'manual work needed'
    })
  };

  paymentObj['createdFromObject'] = payment;
  paymentObj['trackIds'] = [
    trackId,
    ...(payment['trackIds'] || [])
  ];

  logger.debug('Deleting older payment and replacing it with payment of the new format', {
    oldPayment: payment,
    newPayment: paymentObj
  });

  // Delete all other payments
  const payments = [
    ...(await getPayments({ id: (payment.id as string) })),
    ...(await getPayments({
      createdFromObject: {
        id: (payment.createdFromObject?.id as string) || payment.id
      }
    }))
  ];

  for (const ptd of payments) {
    // eslint-disable-next-line no-await-in-loop
    await paymentDb.delete(ptd.id, trackId);
  }

  // Save the payment
  return await paymentDb.update(paymentObj, {
    useSet: true
  });
};

export const updatePaymentStructure = async (payment: IPaymentEntity | string | any, trackId: string): Promise<IPaymentEntity> => {
  if (typeof payment === 'string') {
    payment = await paymentDb.get(payment);
  }

  if (payment.creationDate || payment.createdFromObject) {
    try {
      const paymentObj = await convertOlderPaymentFormat(payment.createdFromObject || payment, trackId);
    } catch (e) {
      logger.critical('boooooo. something wrong', e, payment);
    }
  } else if (payment.createdAt && payment.objectId) {
    return convertObjectId(payment);
  } else {
    logger.info('Skipping payment update', {
      payment
    });

    return null;
  }
};

/**
 * Update the payment structure of all payments
 *
 * @param trackId - the ID to keep the track of the batch
 */
export const updatePayments = async (trackId: string): Promise<void> => {
  const payments = await getPayments({});

  logger.info(`Updating ${payments.length} payments`);

  for(const payment of payments) {
    // eslint-disable-next-line no-await-in-loop
    await updatePaymentStructure(payment, trackId);
  }
};