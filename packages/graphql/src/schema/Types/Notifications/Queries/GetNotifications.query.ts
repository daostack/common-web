import { queryField, list, nonNull, arg } from 'nexus';
import { authorizationService, prisma } from '@common/core';

export const GetNotificationsQuery = queryField('notifications', {
  type: list('Notification'),
  description: 'List of all notifications, readable only by the admin',
  args: {
    paginate: nonNull(
      arg({
        type: 'PaginateInput'
      })
    )
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.notification.read');
  },
  resolve: (root, args) => {
    return prisma.notification
      .findMany({
        orderBy: {
          createdAt: 'desc'
        },

        skip: args.paginate?.skip || undefined,
        take: args.paginate?.take || undefined
      });
  }
});