import { queryField, list } from 'nexus';
import { authorizationService, prisma } from '@common/core';

export const GetNotificationTemplatesQuery = queryField('notificationTemplates', {
  type: list('NotificationTemplate'),
  args: {
    where: 'NotificationTemplateWhereInput',
    paginate: 'PaginateInput'
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.notification.setting.template.read');
  },
  resolve: (root, args) => {
    return prisma.notificationTemplate
      .findMany({
        orderBy: {
          forType: 'asc'
        },

        skip: args.paginate?.skip || undefined,
        take: args.paginate?.take || undefined,

        where: (args.where as any) || undefined
      });
  }
});