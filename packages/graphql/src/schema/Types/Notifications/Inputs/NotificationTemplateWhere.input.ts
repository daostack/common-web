import { inputObjectType } from 'nexus';

export const NotificationTemplateWhereInput = inputObjectType({
  name: 'NotificationTemplateWhereInput',
  definition(t) {
    t.field('language', {
      type: 'NotificationLanguage'
    });

    t.field('forType', {
      type: 'NotificationType'
    });

    t.field('type', {
      type: 'NotificationTemplateType'
    });
  }
});