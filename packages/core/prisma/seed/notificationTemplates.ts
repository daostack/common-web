import { NotificationType, NotificationTemplateType, NotificationLanguage } from '@prisma/client';

import { notificationService } from '@common/core';

import { JoinRequestAcceptedTemplate } from './templates/JoinRequestAccepted';

export interface SeedableTemplate {
  subject: string,
  content: string
}

export const seedNotificationTemplated = async (): Promise<void> => {
  await notificationService.template.create({
    forType: NotificationType.JoinRequestAccepted,
    templateType: NotificationTemplateType.EmailNotification,
    language: NotificationLanguage.EN,

    ...JoinRequestAcceptedTemplate.EN
  });
};