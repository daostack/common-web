import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const UserNotificationTokensExtension = extendType({
  type: 'User',
  definition(t) {
    t.nonNull.list.nonNull.field('notificationTokens', {
      type: 'UserNotificationToken',
      resolve: async (root, args, ctx) => {
        return prisma.user
          .findUnique({
            where: {
              id: await ctx.getUserId()
            }
          })
          .notificationTokens();
      }
    });
  }
});