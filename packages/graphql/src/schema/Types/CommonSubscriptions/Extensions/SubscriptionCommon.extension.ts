import { extendType } from 'nexus';
import { prisma } from '@common/core';

export const SubscriptionCommonExtension = extendType({
  type: 'CommonSubscription',
  definition(t) {
    t.nonNull.field('common', {
      type: 'Common',
      resolve: async (root) => {
        return (await prisma.subscription
          .findUnique({
            where: {
              id: root.id
            }
          })
          .common())!;
      }
    });
  }
});