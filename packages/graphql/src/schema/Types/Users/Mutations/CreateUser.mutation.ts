import { arg, extendType, inputObjectType, nonNull } from 'nexus';

import { userService } from '@common/core';

export const CreateUserInput = inputObjectType({
  name: 'CreateUserInput',
  definition(t) {
    t.nonNull.string('firstName');
    t.nonNull.string('lastName');
    t.nonNull.string('email');
    t.nonNull.string('photo');
    t.nonNull.field('country', {
      type: 'UserCountry'
    });

    t.string('intro');
  }
});

export const CreateUserMutation = extendType({
  type: 'Mutation',
  definition(t) {
    // @ts-ignore
    t.nonNull.field('createUser', {
      description: 'Creates new user in the settings',
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

        return userService.create({
          ...args.input as any,
          id: userDecodedToken.uid,
          emailVerified: userDecodedToken.email === args.input.email && userDecodedToken.email_verified
        });
      }
    });
  }
});