import { queryField, arg, list } from 'nexus';
import { prisma, authorizationService } from '@common/core';

export const GetStatisticsQuery = queryField('statistics', {
  type: list('Statistic'),
  args: {
    where: arg({
      type: 'StatisticsWhereInput'
    })
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.general.read');
  },
  resolve: (root, args) => {
    return prisma.statistic.findMany({
      where: args.where as any
    });
  }
});