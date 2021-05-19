import { extendType, nonNull, stringArg } from 'nexus';
import { prisma, userService } from '@common/core';
import { allPermissions } from '@common/core/dist/domain/validation/permissions';

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