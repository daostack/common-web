import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const NotificationUserExtension = extendType({
  type: 'Notification',
  definition(t) {
    t.nonNull.uuid('userId', {
      description: 'The ID of the linked user'
    });

    t.nonNull.field('user', {
      type: 'User',
      complexity: 10,
      description: 'The linked user. Expensive operation',
      resolve: (root) => {
        return ((root as any).user) || prisma.user.findUnique({
          where: {
            id: root.id
          }
        });
      }
    });
  }
});