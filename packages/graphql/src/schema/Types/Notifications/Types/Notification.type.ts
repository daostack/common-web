import { objectType } from 'nexus';

export const NotificationType = objectType({
  name: 'Notification',
  definition(t) {
    t.implements('BaseEntity');

    t.nonNull.boolean('show', {
      description: 'Whether the notification should be shown in the user notification feed'
    });

    t.nonNull.field('type', {
      type: 'NotificationType'
    });

    t.nonNull.field('seenStatus', {
      type: 'NotificationSeenStatus'
    });
  }
});