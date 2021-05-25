import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const UserCommonsExtension = extendType({
  type: 'User',
  definition(t) {
    t.nonNull.list.nonNull.field('commons', {
      type: 'Common',
      complexity: 30,
      description: 'List of all commons, that the user is currently part of',
      resolve: async (root) => {
        return (await prisma.user
          .findUnique({
            where: {
              id: root.id
            }
          })
          .memberships({
            select: {
              common: true
            }
          }))
          .map((mc) => mc.common);
      }
    });
  }
});