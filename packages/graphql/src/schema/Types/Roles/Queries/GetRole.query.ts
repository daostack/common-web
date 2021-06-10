import { queryField, nonNull } from 'nexus';
import { prisma, authorizationService } from '@common/core';

export const GetRoleQuery = queryField('role', {
  type: 'Role',
  args: {
    where: nonNull('RoleWhereUniqueInput')
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.roles.read');
  },
  resolve: (root, args) => {
    return prisma.role
      .findUnique({
        where: args.where as any
      });
  }
});