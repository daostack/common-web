import { mutationField, nonNull, idArg } from 'nexus';
import { prisma, userService } from '@common/core';

export const VoidUserNotificationTokenMutation = mutationField('voidUserNotificationToken', {
  type: nonNull('UserNotificationToken'),
  args: {
    tokenId: nonNull(idArg())
  },
  authorize: async (root, args, ctx) => {
    const userId = await ctx.getUserId();
    const tokenWithOwnerId = await prisma.userNotificationToken.findUnique({
      where: {
        id: args.tokenId
      },
      select: {
        userId: true
      }
    });

    return !tokenWithOwnerId || userId === tokenWithOwnerId.userId;
  },
  resolve: (root, args) => {
    return userService.voidNotificationToken(args.tokenId);
  }
});