import { queryField, list, arg } from 'nexus';
import { prisma, authorizationService } from '@common/core';

export const GetRolesQuery = queryField('roles', {
  type: list('Role'),
  args: {
    paginate: arg({
      type: 'PaginateInput'
    })
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.roles.read');
  },
  resolve: (root, args) => {
    return prisma.role
      .findMany({
        skip: args.paginate?.skip || undefined,
        take: args.paginate?.take || undefined
      });
  }
});