import { queryField, list, arg } from 'nexus';
import { authorizationService, prisma } from '@common/core';

export const GetNotificationSettingsQuery = queryField('notificationSettings', {
  type: list('NotificationSystemSettings'),
  args: {
    where: arg({
      type: 'NotificationSettingsWhereInput'
    })
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.notification.setting.read');
  },
  // @ts-ignore
  resolve: () => {
    return prisma.notificationSystemSettings
      .findMany({
        orderBy: {
          createdAt: 'asc'
        }
      });
  }
});