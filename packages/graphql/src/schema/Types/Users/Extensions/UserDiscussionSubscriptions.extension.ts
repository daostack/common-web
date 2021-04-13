import { extendType, intArg, arg } from 'nexus';
import { prisma } from '@common/core';

export const UserDiscussionSubscriptionsExtension = extendType({
  type: 'User',
  definition(t) {
    t.nonNull.list.nonNull.field('discussionSubscriptions', {
      type: 'DiscussionSubscription',
      args: {
        take: intArg({
          default: 10
        }),

        skip: intArg({
          default: 0
        }),

        orderBy: arg({
          type: 'DiscussionSubscriptionOrderByInput'
        })
      },
      resolve: (root, args) => {
        return prisma.user
          .findUnique({
            where: {
              id: root.id
            }
          })
          .discussionSubscriptions({
            take: args.take || 10,
            skip: args.skip || 0,
            orderBy: (args.orderBy as any) || {
              createdAt: 'asc'
            }
          });
      }
    });
  }
});