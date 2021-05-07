import { objectType } from 'nexus';

export const NotificationEventSettingsType = objectType({
  name: 'NotificationEventSettings',
  definition(t) {
    t.implements('BaseEntity');

    t.nonNull.boolean('active');

    t.nonNull.boolean('sendToEveryone');
    t.nonNull.boolean('sendToCommon');
    t.nonNull.boolean('sendToUser');

    t.nonNull.string('description');

    t.nonNull.field('sendNotificationType', {
      type: 'NotificationType'
    });

    t.nonNull.field('onEvent', {
      type: 'EventType'
    });
  }
});