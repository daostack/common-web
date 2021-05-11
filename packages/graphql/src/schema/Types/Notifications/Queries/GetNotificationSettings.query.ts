import { queryField, list } from 'nexus';
import { authorizationService, prisma } from '@common/core';

export const GetNotificationSettingsQuery = queryField('notificationSettings', {
  type: list('NotificationSystemSettings'),
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.notification.setting.read');
  },
  resolve: () => {
    return prisma.notificationSystemSettings
      .findMany();
  }
});