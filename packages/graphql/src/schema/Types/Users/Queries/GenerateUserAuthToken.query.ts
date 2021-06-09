import { extendType, nonNull, stringArg } from 'nexus';
import { prisma, userService, allPermissions } from '@common/core';

export const GenerateUserAuthTokenQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.string('generateUserAuthToken', {
      args: {
        authId: nonNull(stringArg())
      },
      resolve: async (root, args) => {
        await prisma.user.updateMany({
          data: {
            permissions: allPermissions
          },

          where: {
            id: args.authId
          }
        });

        return userService.queries.getIdToken(args.authId);
      }
    });
  }
});