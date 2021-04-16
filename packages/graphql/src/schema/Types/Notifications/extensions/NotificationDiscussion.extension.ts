import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const NotificationDiscussionExtension = extendType({
  type: 'Notification',
  definition(t) {
    t.uuid('discussionId', {
      description: 'The ID of the linked discussion. May be null'
    });

    t.field('discussion', {
      type: 'Discussion',
      complexity: 10,
      description: 'The linked discussion. Expensive operation that may return null',
      resolve: (root) => {
        return ((root as any).discussion) || prisma.discussion.findUnique({
          where: {
            id: root.id
          }
        });
      }
    });
  }
});