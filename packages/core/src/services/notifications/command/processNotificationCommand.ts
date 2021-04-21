import { NotificationProcessStatus } from '@prisma/client';

import { logger } from '@logger';
import { prisma } from '@toolkits';
import { CommonError } from '@errors';

import { mailer } from '../mailer';
import { pusher } from '../pusher';

export const processNotificationCommand = async (notificationId: string): Promise<void> => {
  // Find the notification
  const notification = await prisma.notification.findUnique({
    where: {
      id: notificationId
    }
  });

  if (!notification || notification.status !== NotificationProcessStatus.NotProcessed) {
    throw new CommonError('Cannot process the notification', {
      notification
    });
  }

  // Find the notification settings
  const settings = await prisma.notificationSystemSettings.findUnique({
    where: {
      type: notification.type
    }
  });

  if (!settings) {
    logger.error(`No notification settings for notification type ${notification.type}`);

    return;
  }

  if (settings.sendEmail) {
    await mailer.sendEmailNotification(notification);
  }

  if (settings.sendPush) {
    await pusher.sendPushNotification(notification);
  }

  // Mark the notification as processed
  await prisma.notification.update({
    where: {
      id: notification.id
    },
    data: {
      status: NotificationProcessStatus.Processed
    },
    select: {
      id: true
    }
  });
};