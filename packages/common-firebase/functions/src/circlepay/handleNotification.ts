import { CommonError } from '../util/errors';
import { ICircleNotification } from '../util/types';

// import { saveSubscriptionPayment } from './createSubscriptionPayment';

/**
 * Handles incoming CirclePay notification
 *
 * @param notification - the notification that we have received
 *
 * @throws { CommonError } - if the notification type is different than payment
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

  logger.warn('New notification from circle', {
    notification
  })
};