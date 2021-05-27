import { queryField, list, arg, nonNull } from 'nexus';
import { authorizationService, prisma } from '@common/core';

export const GetNotificationEventSettingsQuery = queryField('notificationEventSettings', {
  type: list('NotificationEventSettings'),
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.notification.setting.event.read');
  },
  args: {
    paginate: nonNull(
      arg({
        type: 'PaginateInput'
      })
    )
  },
  resolve: (root, args) => {
    return prisma.notificationEventSettings
      .findMany({
        orderBy: {
          createdAt: 'desc'
        },
        skip: args.paginate?.skip || undefined,
        take: args.paginate?.take || undefined
      });
  }
});