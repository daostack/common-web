import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const DiscussionMessageOwnerExtension = extendType({
  type: 'DiscussionMessage',
  definition(t) {
    t.nonNull.field('owner', {
      type: 'User',
      resolve: (root) => {
        return prisma.user.findUnique({
            where: {
              id: root.userId
            }
          });
      }
    });
  }
});