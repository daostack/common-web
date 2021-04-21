import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const NotificationCommonExtension = extendType({
  type: 'Notification',
  definition(t) {
    t.uuid('commonId', {
      description: 'The ID of the linked common. May be null'
    });

    t.field('common', {
      type: 'Common',
      complexity: 10,
      description: 'The linked common. Expensive operation that may return null',
      resolve: (root) => {
        return ((root as any).common) || prisma.common.findUnique({
          where: {
            id: root.commonId
          }
        });
      }
    });
  }
});