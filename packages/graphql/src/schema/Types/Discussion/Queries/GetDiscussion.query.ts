import { extendType, idArg, nonNull } from 'nexus';
import { prisma } from '@common/core';

export const GetDiscussionQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('discussion', {
      type: 'Discussion',
      args: {
        id: nonNull(idArg())
      },
      resolve: (root, args) => {
        return prisma.discussion.findUnique({
          where: {
            id: args.id
          }
        });
      }
    });
  }
});