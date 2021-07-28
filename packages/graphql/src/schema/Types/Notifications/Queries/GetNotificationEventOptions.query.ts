import { queryField } from 'nexus';
import { authorizationService } from '@common/core';

export const GetNotificationEventOptionsQuery = queryField('notificationEventOptions', {
  type: 'NotificationEventOptions',
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), {
      or: [
        'admin.notification.setting.event.create',
        'admin.notification.setting.event.update'
      ]
    });
  },
  resolve: () => ({})
});