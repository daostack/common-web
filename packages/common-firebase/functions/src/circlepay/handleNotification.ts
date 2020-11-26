import { EVENT_TYPES } from '../event/event';

import { CommonError } from '../util/errors';
import { createEvent } from '../util/db/eventDbService';
import { getPaymentSnapshot } from '../util/db/paymentDb';
import { ICircleNotification, IPaymentEntity } from '../util/types';

import { subscriptionDb } from '../subscriptions/database';
import { handleFailedPayment, handleSuccessfulSubscriptionPayment } from '../subscriptions/business';

import { saveSubscriptionPayment } from './createSubscriptionPayment';

/**
 * Handles incoming CirclePay notification
 *
 * @param notification - the notification that we have received
 *
 * @throws { CommonError } - if the notification type is different than payment
 * @throws { CommonError } - if the payment does not exists
 * @throws { CommonError } - if the payment status is not one of the know ones
 */
export const handleNotification = async (notification: ICircleNotification): Promise<void> => {
  if (notification.notificationType !== 'payments' || !notification.payment) {
    throw new CommonError(`
      Cannot handle notification that is not of type 'payments' 
      or does not have payment object!
    `, {
      notification,
      notificationString: JSON.stringify(notification)
    });
  }

  const paymentSnap = await getPaymentSnapshot(notification.payment.id)

  if (!paymentSnap.exists) {
    throw new CommonError(`
      Cannot find payment with id ${notification.payment.id}
    `);
  }

  const paymentObj = paymentSnap.data() as IPaymentEntity;

  if(paymentObj.type === 'SubscriptionPayment') {
    const subscription = await subscriptionDb.get(paymentObj.subscriptionId);
    const updateRes = await saveSubscriptionPayment(subscription, notification.payment);

    const createPaymentEvent = async (type: EVENT_TYPES): Promise<void> => {
      await createEvent({
        userId: subscription.userId,
        objectId: paymentObj.id,
        type
      });
    }

    switch (notification.payment.status) {
      case 'pending':
        // Here we do not do anything because the event
        // should be handled in other place

        break;

      case 'paid':
      case 'confirmed':
        await createPaymentEvent(
          notification.payment.status === 'paid'
            ? EVENT_TYPES.PAYMENT_PAID
            : EVENT_TYPES.PAYMENT_CONFIRMED
        );

        // This should be only done once
        if(paymentObj.status !== 'paid' && paymentObj.status !== 'confirmed') {
          await handleSuccessfulSubscriptionPayment(subscription);
        }

        break;
      case 'failed':
        console.warn('Subscription payment failed!', subscription.id, paymentObj.id);
        await createPaymentEvent(EVENT_TYPES.PAYMENT_FAILED);

        // This is good place to retry the payment?
        await handleFailedPayment(subscription, updateRes.payment);

        break;
      default:
        throw new CommonError(`Unknown payment status: ${notification.payment.status}`)
    }
  } else {
    console.warn('Non subscription payments are not currently supported!');
  }
};