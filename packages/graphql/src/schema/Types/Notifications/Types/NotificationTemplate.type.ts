import { objectType } from 'nexus';

export const NotificationTemplateType = objectType({
  name: 'NotificationTemplate',
  definition(t) {
    t.implements('BaseEntity');

    t.nonNull.field('forType', {
      type: 'NotificationType'
    });

    t.nonNull.field('templateType', {
      type: 'NotificationTemplateType'
    });

    t.nonNull.field('language', {
      type: 'NotificationLanguage'
    });

    t.nonNull.string('subject');
    t.nonNull.string('content');

    t.string('from');
    t.string('fromName');

    t.string('bcc');
    t.string('bccName');
  }
});