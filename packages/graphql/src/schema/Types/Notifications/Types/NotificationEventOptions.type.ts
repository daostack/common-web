import { objectType } from 'nexus';
import { NotificationType, EventType } from '@prisma/client';

export const NotificationEventOptionsType = objectType({
  name: 'NotificationEventOptions',
  definition(t) {
    t.nonNull.list.nonNull.field('availableNotifications', {
      type: 'NotificationType',
      // @ts-ignore
      resolve: () => {
        return Object.values(NotificationType);
      }
    });

    t.nonNull.list.nonNull.field('availableEvents', {
      type: 'EventType',
      resolve: () => {
        return Object.values(EventType);
      }
    });
  }
});