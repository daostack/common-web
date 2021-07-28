import { extendType } from 'nexus';
import { prisma, authorizationService } from '@common/core';

export const UserWiresExtension = extendType({
  type: 'User',
  definition(t) {
    t.nonNull.list.nonNull.field('wires', {
      type: 'Wire',
      authorize: async (root, args, ctx) => {
        const userId = await ctx.getUserId();

        return root.id === userId || authorizationService.can(userId, 'admin.wire.read');
      },
      resolve: (root) => {
        return prisma.user
          .findUnique({
            where: {
              id: root.id
            }
          })
          .wires();
      }
    });
  }
});