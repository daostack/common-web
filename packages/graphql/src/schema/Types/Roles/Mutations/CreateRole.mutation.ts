import { mutationField, inputObjectType, arg, nonNull } from 'nexus';
import { roleService, authorizationService } from '@common/core';

export const CreateRoleInput = inputObjectType({
  name: 'CreateRoleInput',
  definition(t) {
    t.nonNull.string('name');
    t.nonNull.string('displayName');
    t.nonNull.string('description');

    t.nonNull.list.nonNull.string('permissions');
  }
});

export const CreateRoleMutation = mutationField('createRole', {
  type: 'Role',
  args: {
    input: nonNull(arg({
      type: CreateRoleInput
    }))
  },
  authorize: async (root, args, ctx) =>
    authorizationService.can(await ctx.getUserId(), 'admin.roles.create'),
  resolve: async (root, args) => {
    return roleService.create({
      ...args.input,
      permissions: args.input.permissions as any
    });
  }
});