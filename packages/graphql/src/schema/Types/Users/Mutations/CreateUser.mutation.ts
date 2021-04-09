import { arg, extendType, inputObjectType, nonNull } from 'nexus';

import { userService } from '@common/core';

export const CreateUserInput = inputObjectType({
  name: 'CreateUserInput',
  definition(t) {
    t.nonNull.string('firstName');
    t.nonNull.string('lastName');
    t.nonNull.string('email');
  }
});

export const CreateUserMutation = extendType({
  type: 'Mutation',
  definition(t) {
    // @ts-ignore
    t.nonNull.field('createUser', {
      description: 'Creates new user in the system',
      type: 'User',
      args: {
        input: nonNull(
          arg({
            type: CreateUserInput
          })
        )
      },
      resolve: async (root, args, ctx) => {
        const userDecodedToken = await ctx.getUserDecodedToken();

        return userService.commands.create({
          ...args.input,
          id: userDecodedToken.uid,
          emailVerified: userDecodedToken.email === args.input.email && userDecodedToken.email_verified
        });
      }
    });
  }
});