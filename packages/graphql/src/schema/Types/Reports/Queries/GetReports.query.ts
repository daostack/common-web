import { queryField, list, arg } from 'nexus';
import { authorizationService, prisma } from '@common/core';

export const GetReportsQuery = queryField('reports', {
  type: list('Report'),
  args: {
    where: arg({
      type: 'ReportWhereInput'
    }),
    pagination: arg({
      type: 'PaginateInput'
    })
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.report.read');
  },
  resolve: (root, { where, paginate }) => {
    return prisma.report
      .findMany({
        ...paginate,
        where: where as any
      });
  }
});