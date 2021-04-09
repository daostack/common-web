import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const CommonMemberUserExtension = extendType({
  type: 'CommonMember',
  definition(t) {
    t.field('user', {
      type: 'User',
      complexity: 15,
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