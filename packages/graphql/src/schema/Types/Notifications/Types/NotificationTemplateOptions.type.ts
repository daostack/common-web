import { NotificationLanguage, NotificationTemplateType, NotificationType } from '@prisma/client';
import { objectType } from 'nexus';

export const NotificationTemplateOptionsType = objectType({
  name: 'NotificationTemplateOptions',
  definition(t) {
    t.nonNull.list.field('languages', {
      type: 'NotificationLanguage',
      resolve: () => Object.keys(NotificationLanguage) as any[]
    });

    t.nonNull.list.field('templateTypes', {
      type: 'NotificationTemplateType',
      resolve: () => Object.keys(NotificationTemplateType) as any[]
    });

    t.nonNull.list.field('notificationTypes', {
      type: 'NotificationType',
      resolve: () => Object.keys(NotificationType) as any[]
    });
  }
});