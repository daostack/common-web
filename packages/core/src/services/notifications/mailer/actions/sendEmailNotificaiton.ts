import { Notification, NotificationTemplateType } from '@prisma/client';

import { CommonError } from '@errors';
import { prisma, SendgridToolkit } from '@toolkits';
import { notificationsHelper } from '../../helpers';

const defaultLocale = 'EN';

export const sendEmailNotification = async (notification: Notification): Promise<void> => {
  // Find the user locale and email
  const user = (await prisma.user.findUnique({
    where: {
      id: notification.userId
    },
    select: {
      email: true,
      lastName: true,
      firstName: true,
      notificationLanguage: true
    }
  }))!;

  const locale = user.notificationLanguage;

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

  // Template the notification
  const { subject, content } = await notificationsHelper.template(template, notification);

  // Send the template
  await SendgridToolkit.sendMail({
    to: {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email
    },

    from: {
      name: template.fromName || (process.env['Sendgrid.Default.From.Name'] as string),
      email: template.from || (process.env['Sendgrid.Default.From.Email'] as string)
    },

    bcc: template.bcc || undefined,

    subject,
    text: content,
    html: content
  });
};