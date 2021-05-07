import { mutationField, nonNull, idArg } from 'nexus';
import { authorizationService, roleService } from '@common/core';

export const AssignRoleMutation = mutationField('assignRole', {
  type: 'Void',
  args: {
    userId: nonNull(idArg()),
    roleId: nonNull(idArg())
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.roles.assign');
  },
  resolve: async (root, args) => {
    await roleService.users.addToRole(args.userId, args.roleId);
  }
});