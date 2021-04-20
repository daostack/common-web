import { extendType, arg } from 'nexus';
import { authorizationService, prisma } from '@common/core';

export const CommonReportsExtension = extendType({
  type: 'Common',
  definition(t) {
    t.nonNull.list.nonNull.field('reports', {
      type: 'Report',
      complexity: 25,
      authorize: async (root, args, ctx) => {
        const userId = await ctx.getUserId();

        return authorizationService.reports.canSeeCommonReports(userId, root.id);
      },
      args: {
        where: arg({
          type: 'ReportWhereInput'
        })
      },
      resolve: async (root, args) => {
        return prisma.common
          .findUnique({
            where: {
              id: root.id
            }
          })
          .reports({
            where: args.where
          });
      }
    });
  }
});