import { queryField, idArg } from 'nexus';
import { authorizationService, prisma } from '@common/core';

export const GetPaymentQuery = queryField('payment', {
  type: 'Payment',
  args: {
    id: idArg()
  },
  authorize: async (root, args, ctx) => {
    const userId = await ctx.getUserId();

    return (root as any).userId === userId || authorizationService.can(userId, 'admin.financials.payments.read');
  },
  resolve: (root, args) => {
    return prisma.payment
      .findUnique({
        where: {
          id: args.id || undefined
        }
      });
  }
});