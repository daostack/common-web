import { Notification, NotificationTemplateType } from '@prisma/client';
import { set } from 'lodash';

import { NotImplementedError, CommonError } from '@errors';
import { prisma } from '@toolkits';

const defaultLocale = 'EN';

export const sendEmailNotification = async (notification: Notification): Promise<void> => {
  // @todo Find the user locale
  const locale = 'EN';

  // Find the email template
  const template = await prisma.notificationTemplate.findFirst({
    where: {
      templateType: NotificationTemplateType.EmailNotification,
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

  // Template the template

  // Check what entities need to be fetched
  const includeStubs = {};

  for (const stub of template.stubs) {
    set(includeStubs, stub, true);
  }

  const notificationWithEntities = await prisma.notification.findUnique({
    where: {
      id: notification.id
    },
    include: includeStubs
  });

  // Send the created template

  throw new NotImplementedError();
};

const testObject = {
  nested: {
    inTheNest: 'fsdfs'
  }
};

testObject['nested']['inTheNest'];