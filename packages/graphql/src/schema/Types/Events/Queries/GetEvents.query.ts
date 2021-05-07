import { arg, queryField, list } from 'nexus';
import { prisma, authorizationService } from '@common/core';

export const GetEventsQuery = queryField('events', {
  type: list('Event'),
  args: {
    paginate: arg({
      type: 'PaginateInput'
    })
  },
  authorize: async (root, args, ctx) =>
    authorizationService.can(await ctx.getUserId(), 'admin.events.read'),
  resolve: async (root, args) => {
    return prisma.event
      .findMany({
        skip: args.paginate?.skip || undefined,
        take: args.paginate?.take || undefined
      });
  }
});