import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const RoleUsersExtension = extendType({
  type: 'Role',
  definition(t) {
    t.nonNull.list.nonNull.field('users', {
      type: 'User',
      description: 'All the users that bear that role',
      resolve: (root) => {
        return prisma.role
          .findUnique({
            where: {
              id: root.id
            }
          })
          .users();
      }
    });
  }
});