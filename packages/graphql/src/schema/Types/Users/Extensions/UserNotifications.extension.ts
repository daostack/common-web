import { extendType, intArg, arg } from 'nexus';
import { prisma, CommonError } from '@common/core';

export const UserNotificationsExtension = extendType({
  type: 'User',
  definition(t) {
    t.nonNull.list.nonNull.field('notifications', {
      complexity: 10,
      type: 'Notification',
      authorize: async (root, args, ctx) => {
        return root.id === (await ctx.getUserId());
      },
      args: {
        orderBy: arg({
          type: 'NotificationOrderByInput',
          default: {
            createdAt: 'desc'
          }
        }),

        cursor: arg({
          type: 'NotificationWhereUniqueInput'
        }),

        take: intArg({
          default: 10
        }),

        skip: intArg()
      },
      // @ts-ignore
      resolve: (root, args) => {
        if (args.take && args.take > 25) {
          throw new CommonError('Cannot get more that 25 notification at a time');
        }

        return prisma.user
          .findUnique({
            where: {
              id: root.id
            }
          })
          .notifications({
            take: args.take || undefined,
            skip: args.skip || undefined,

            cursor: (args.cursor) || undefined,
            orderBy: (args.orderBy as any) || undefined
          });
      }
    });
  }
});