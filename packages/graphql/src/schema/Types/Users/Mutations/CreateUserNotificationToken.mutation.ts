import { extendType, inputObjectType, nonNull, arg } from 'nexus';
import { userService } from '@common/core';

export const CreateUserNotificationTokenInput = inputObjectType({
  name: 'CreateUserNotificationTokenInput',
  definition(t) {
    t.nonNull.string('token');
    t.nonNull.string('description');
  }
});

export const CreateUserNotificationTokenMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createUserNotificationToken', {
      type: 'UserNotificationToken',
      args: {
        input: nonNull(
          arg({
            type: CreateUserNotificationTokenInput
          })
        )
      },
      resolve: async (root, args, ctx) => {
        const userId = await ctx.getUserId();

        return userService.createNotificationToken({
          userId,
          ...args.input
        });
      }
    });
  }
});