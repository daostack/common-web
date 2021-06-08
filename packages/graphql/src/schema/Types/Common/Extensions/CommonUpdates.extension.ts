import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const CommonUpdatesExtension = extendType({
  type: 'Common',
  definition(t) {
    t.nonNull.list.nonNull.field('updates', {
      type: 'CommonUpdate',
      resolve: (root) =>
        prisma.common
          .findUnique({
            where: {
              id: root.id
            }
          })
          .updates({
            orderBy: {
              createdAt: 'desc'
            }
          })
    });
  }
});