import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const DiscussionSubscriptionDiscussionExtension = extendType({
  type: 'DiscussionSubscription',
  definition(t) {
    t.nonNull.field('discussion', {
      complexity: 10,
      type: 'Discussion',
      resolve: async (root) => {
        return (await prisma.discussionSubscription
          .findUnique({
            where: {
              id: root.id
            }
          })
          .discussion())!;
      }
    });
  }
});