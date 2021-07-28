import { queryField, nonNull, idArg } from 'nexus';
import { authorizationService, prisma } from '@common/core';

export const GetReportQuery = queryField('report', {
  type: 'Report',
  args: {
    id: nonNull(idArg())
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.report.read');
  },
  resolve: async (root, args) => {
    return (await prisma.report
        .findUnique({
          where: {
            id: args.id
          }
        })
    )!;
  }
});