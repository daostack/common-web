import { extendType } from 'nexus';
import { authorizationService, prisma } from '@common/core';

export const UserBillingDetailsExtension = extendType({
  type: 'User',
  definition(t) {
    t.nonNull.list.nonNull.field('billingDetails', {
      type: 'UserBillingDetails',
      authorize: async (root, args, ctx) => {
        const userId = await ctx.getUserId();

        return root.id === userId || authorizationService.can(userId, 'admin.users.billingDetails.read');
      },
      resolve: (root) => {
        return prisma.user
          .findUnique({
            where: {
              id: root.id
            }
          })
          .billinDetails();
      }
    });
  }
});