import { objectType } from 'nexus';
import { authorizationService, allPermissions } from '@common/core';

export const SettingsType = objectType({
  name: 'Settings',
  description: 'Setting description about the common application',
  definition(t) {
    t.nonNull.list.string('permissions', {
      description: 'List of all available permission for roles',
      authorize: async (root, args, ctx) => {
        return authorizationService.can(await ctx.getUserId(), {
          or: [
            'admin.roles.create',
            'admin.roles.update'
          ]
        });
      },
      resolve: () => allPermissions as unknown as string[]
    });
  }
});