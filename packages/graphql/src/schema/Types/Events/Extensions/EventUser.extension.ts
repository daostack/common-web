import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const EventUserExtension = extendType({
  type: 'Event',
  definition(t) {
    t.id('userId', {
      description: 'The ID of the event creator'
    });

    t.field('user', {
      type: 'User',
      complexity: 10,
      description: 'The event creator',
      resolve: (root) => {
        if (!root.userId) {
          return null;
        }

        return prisma.user
          .findUnique({
            where: {
              id: root.userId
            }
          });
      }
    });
  }
});