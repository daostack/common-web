import { mutationField, inputObjectType, nonNull, arg } from 'nexus';
import { userService, authorizationService } from '@common/core';

const UpdateUserInput = inputObjectType({
  name: 'UpdateUserInput',
  definition(t) {
    t.nonNull.string('id', {
      description: 'The ID of the user to be updated'
    });

    t.string('firstName');
    t.string('lastName');

    t.string('photo');
    t.string('intro');

    t.field('country', {
      type: 'Country'
    });

    t.field('notificationLanguage', {
      type: 'NotificationLanguage'
    });
  }
});

export const UpdateUserMutation = mutationField('updateUser', {
  type: 'User',
  args: {
    input: nonNull(
      arg({
        type: UpdateUserInput
      })
    )
  },
  authorize: async (root, args, ctx) => {
    const userId = await ctx.getUserId();

    return userId === args.input.id || authorizationService.can(userId, 'admin.users.update');
  },
  resolve: (root, args) => {
    return userService.update(args.input as any);
  }
});