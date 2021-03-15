import { arg, extendType, inputObjectType, nonNull } from 'nexus';
import { userService } from '@services';

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
    t.nonNull.string('createUser', {
      description: 'Creates new user in the system',
      args: {
        input: nonNull(
          arg({
            type: CreateUserInput
          })
        )
      },
      resolve: (root, args, ctx) => {
        return userService.commands.create({
          authId: '@todo',
          ...args.input
        });
      }
    });
  }
});