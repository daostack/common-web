import { objectType } from 'nexus';

export const NotificationSystemSettingsType = objectType({
  name: 'NotificationSystemSettings',
  definition(t) {
    t.implements('BaseEntity');

    t.nonNull.field('type', {
      type: 'NotificationType'
    });

    t.nonNull.boolean('sendEmail');
    t.nonNull.boolean('sendPush');
    t.nonNull.boolean('showInUserFeed');
  }
});