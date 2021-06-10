import { queryField } from 'nexus';
import { authorizationService } from '@common/core';

export const GetNotificationTemplateOptionsQuery = queryField('notificationTemplateOptions', {
  type: 'NotificationTemplateOptions',
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), {
      or: [
        'admin.notification.setting.template.create',
        'admin.notification.setting.template.update'
      ]
    });
  },
  resolve: () => ({})
});