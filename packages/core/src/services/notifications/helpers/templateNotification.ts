import { set } from 'lodash';
import { Notification, NotificationLanguage, NotificationTemplate } from '@prisma/client';

import { prisma } from '@toolkits';

import { notificationsHelper } from './index';
import { ISendableNotification } from './stubReplacer';

const defaultLocale: NotificationLanguage = 'EN';

export const templateNotification = async (template: NotificationTemplate, notification: Notification): Promise<ISendableNotification> => {
  // Check what entities need to be fetched
  const includeStubs = {};

  // Convert the stubs to data quearable
  for (const stub of template.stubs.filter((stub) => stub.split('.')[0] !== 'default')) {
    set(includeStubs, stub.split('.').join('.select.'), true);
  }

  // Fetch the needed data
  const notificationWithEntities = await prisma.notification.findUnique({
    where: {
      id: notification.id
    },
    include: includeStubs
  });

  // Send the created template
  return notificationsHelper.replaceSubs(notificationWithEntities, template);
};