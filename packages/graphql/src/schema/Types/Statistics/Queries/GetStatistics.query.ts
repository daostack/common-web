import { queryField, arg, list } from 'nexus';
import { prisma } from '@common/core';

export const GetStatisticsQuery = queryField('getStatistics', {
  type: list('Statistic'),
  args: {
    where: arg({
      type: 'StatisticsWhereInput'
    })
  },
  resolve: (root, args) => {
    return prisma.statistic.findMany({
      where: args.where as any
    });
  }
});