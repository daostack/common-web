import { inputObjectType } from 'nexus';

export const NotificationSettingsWhereInput = inputObjectType({
  name: 'NotificationSettingsWhereInput',
  definition(t) {
    t.field('type', {
      type: 'NotificationType',
      description: 'The type of the notification'
    });
  }
});