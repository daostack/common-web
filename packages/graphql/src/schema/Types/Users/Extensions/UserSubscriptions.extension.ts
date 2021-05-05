import { prisma } from '@common/core';
import { extendType } from 'nexus';

export const UserSubscriptionsExtension = extendType({
  type: 'User',
  definition: t => {
    t.nonNull.list.nonNull.field('subscriptions', {
      type: 'CommonSubscription',
      resolve: async (root) => {
        return (await prisma.user
          .findUnique({
            where: {
              id: root.id
            }
          })
          .subscriptions())!;
      }
    });
  }
});