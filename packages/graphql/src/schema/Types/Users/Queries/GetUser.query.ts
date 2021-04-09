import { extendType, idArg } from 'nexus';
import { prisma } from '@common/core';

export const GetUserQuery = extendType({
  type: 'Query',
  definition: function (t) {
    t.field('user', {
      type: 'User',
      description: 'Provide ID to fetch specific user or do not pass anything to get the currently authenticated user',
      args: {
        userId: idArg()
      },
      resolve: async (root, args, ctx) => {
        const userId = args.userId || (await ctx.getUserId());

        return prisma.user.findUnique({
          where: {
            id: userId
          }
        });
      }
    });
  }
});