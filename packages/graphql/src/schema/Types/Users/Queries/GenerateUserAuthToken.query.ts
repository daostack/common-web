import { extendType, nonNull, stringArg } from 'nexus';
import { userService } from '@common/core';

export const GenerateUserAuthTokenQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.string('generateUserAuthToken', {
      args: {
        authId: nonNull(stringArg())
      },
      resolve: async (root, args) => {
        return userService.queries.getIdToken(args.authId);
      }
    });
  }
});