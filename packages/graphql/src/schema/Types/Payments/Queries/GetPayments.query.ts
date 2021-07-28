import { queryField, list, arg } from 'nexus';
import { prisma, authorizationService } from '@common/core';

export const GetPaymentsQuery = queryField('payments', {
  type: list('Payment'),
  args: {
    paginate: arg({
      type: 'PaginateInput'
    }),

    where: 'PaymentsWhereInput'
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.financials.payments.read');
  },
  resolve: (root, args) => {
    return prisma.payment
      .findMany({
        ...args.paginate as any,
        where: args.where as any
      });
  }
});