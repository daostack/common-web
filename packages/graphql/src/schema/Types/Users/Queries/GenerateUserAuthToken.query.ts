import { extendType, nonNull, stringArg } from 'nexus';
import { userService } from '@common/core';
import { notificationService } from '@common/core/dist/services';
import { NotificationType } from '@prisma/client';


export const GenerateUserAuthTokenQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.string('generateUserAuthToken', {
      args: {
        authId: nonNull(stringArg())
      },
      resolve: async (root, args) => {
        await notificationService.create({
          type: NotificationType.RequestToJoinAccepted,
          userId: args.authId
        });

        return userService.queries.getIdToken(args.authId);
      }
    });
  }
});