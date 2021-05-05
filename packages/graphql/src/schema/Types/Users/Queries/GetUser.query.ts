import { extendType, arg } from 'nexus';
import { prisma } from '@common/core';

export const GetUserQuery = extendType({
  type: 'Query',
  definition: function (t) {
    t.field('user', {
      type: 'User',
      description: 'Provide ID to fetch specific user or do not pass anything to get the currently authenticated user',
      args: {
        where: arg({
          type: 'UserWhereUniqueInput'
        })
      },
      resolve: async (root, args, ctx) => {
        const userId = args?.where?.userId || (await ctx.getUserId());

        return prisma.user.findUnique({
          where: {
            id: userId
          }
        });
      }
    });
  }
});