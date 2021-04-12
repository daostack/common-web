import { extendType, intArg, arg } from 'nexus';
import { prisma } from '@common/core';

export const DiscussionMessagesExtension = extendType({
  type: 'Discussion',
  definition(t) {
    t.nonNull.list.nonNull.field('messages', {
      type: 'DiscussionMessage',
      complexity: 10,
      args: {
        take: intArg({
          default: 10
        }),

        skip: intArg({
          default: 0
        }),

        orderBy: arg({
          type: 'DiscussionMessagesOrderByInput',
          default: {
            createdAt: 'asc'
          }
        })
      },
      resolve: async (root, args) => {
        return prisma.discussionMessage
          .findMany({
            where: {
              discussionId: root.id
            },
            take: args.take || 10,
            skip: args.skip || undefined,
            orderBy: (args.orderBy as any)
          });
      }
    });
  }
});