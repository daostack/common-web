import { extendType } from 'nexus';
import { authorizationService, prisma } from '@common/core';

export const DiscussionMessageReportsExtension = extendType({
  type: 'DiscussionMessage',
  definition(t) {
    t.nonNull.list.nonNull.field('reports', {
      type: 'Report',
      authorize: async (root, args, ctx) => {
        const userId = await ctx.getUserId();

        return authorizationService.reports.canSeeMessageReports(userId, root.id);
      },
      resolve: (root) => {
        return prisma.discussionMessage
          .findUnique({
            where: {
              id: root.id
            }
          })
          .reports();
      }
    });
  }
});