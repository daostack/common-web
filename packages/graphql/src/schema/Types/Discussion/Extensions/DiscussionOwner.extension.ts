import { prisma } from '@common/core';
import { extendType } from 'nexus';


export const DiscussionOwnerExtension = extendType({
  type: 'Discussion',
  definition(t) {
    t.field('owner', {
      type: 'User',
      complexity: 10,
      description: 'The discussion creator',
      resolve: async (root, args) => {
        return await prisma.user.findUnique({
            where: {
              id: root.userId
            }
          });
      }
    });
  }
});