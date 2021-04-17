import { Notification, UserNotificationTokenState, NotificationTemplateType } from '@prisma/client';

import { logger } from '@logger';
import { CommonError } from '@errors';
import { prisma, FirebaseToolkit } from '@toolkits';

import { notificationsHelper } from '../../helpers';

const defaultLocale = 'EN';

export const sendPushNotification = async (notification: Notification): Promise<void> => {
  // Find the user locale and all active notification tokens
  const user = (await prisma.user.findUnique({
    where: {
      id: notification.userId
    },
    select: {
      notificationLanguage: true,

      notificationTokens: {
        where: {
          state: UserNotificationTokenState.Active
        }
      }
    }
  }))!;

  const locale = user.notificationLanguage;

  // Find the push notification template
  const template = await prisma.notificationTemplate.findFirst({
    where: {
      templateType: NotificationTemplateType.PushNotification,
      forType: notification.type,

      OR: [{
        language: locale
      }, {
        language: defaultLocale
      }]
    }
  });

  if (!template) {
    throw new CommonError('Cannot find the requested template');
  }

  // Template the notification
  const { subject, content } = await notificationsHelper.template(template, notification);

  // Extract the tokens
  const tokens = user.notificationTokens.map(t => t.token);

  if (!tokens.length) {
    logger.warn('Not sending push notification to user because they do not have active notification tokens!', {
      userId: notification.userId
    });

    return;
  }

  const message = await FirebaseToolkit.messaging.sendToDevice(tokens, {
    data: {
      path: '@todo'
    },
    notification: {
      title: subject,
      body: content
    }
  });

  // @todo Process message send result
};