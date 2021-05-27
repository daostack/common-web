import { mutationField, nonNull, idArg } from 'nexus';
import { authorizationService, roleService } from '@common/core';

export const UnassignRoleMutation = mutationField('unassignRole', {
  type: 'Void',
  args: {
    userId: nonNull(idArg()),
    roleId: nonNull(idArg())
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.roles.unassign');
  },
  resolve: (root, args) => {
    return roleService.users.removeFromRole(args.userId, args.roleId);
  }
});

