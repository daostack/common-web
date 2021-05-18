import { objectType } from 'nexus';
import { authorizationService } from '@common/core';

export const UserType = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id', {
      description: 'The settings Id of the user'
    });

    t.nonNull.date('createdAt', {
      description: 'The date, at which the item was created'
    });

    t.nonNull.date('updatedAt', {
      description: 'The date, at which the item was last modified'
    });

    t.nonNull.string('firstName', {
      description: 'The first name of the user'
    });

    t.nonNull.string('lastName', {
      description: 'The last name of the user'
    });

    t.nonNull.field('country', {
      type: 'UserCountry',
      description: 'The last name of the user',
      authorize: async (root, args, ctx) => {
        const userId = await ctx.getUserId();

        return (userId === root.id);
      }
    });

    t.string('intro');

    t.nonNull.string('displayName', {
      description: 'The display name of the user',
      resolve: (root) => {
        return `${root.firstName[0].toUpperCase()}. ${root.lastName}`;
      }
    });

    t.nonNull.string('photo');

    t.nonNull.string('email', {
      description: 'The email of the user'
    });

    t.nonNull.list.nonNull.string('permissions', {
      description: 'List of all the users permissions',
      authorize: async (root, args, ctx) => {
        const userId = await ctx.getUserId();

        return (
          // If the user is reading it's permissions
          userId === root.id ||

          // If the user can read other users permissions
          await authorizationService.can(userId, 'user.permissions.read')
        );

      }
    });
  }
});
