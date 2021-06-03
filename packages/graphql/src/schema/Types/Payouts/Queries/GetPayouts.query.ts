import { queryField, list, arg } from 'nexus';
import { authorizationService, prisma } from '@common/core';

export const GetPayoutsQuery = queryField('payouts', {
  type: list('Payout'),
  args: {
    paginate: arg({
      type: 'PaginateInput',
      default: {
        take: 10,
        skip: 0
      }
    }),
    where: arg({
      type: 'PayoutWhereInput'
    })
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.financials.payouts.read');
  },
  resolve: (root, args) => {
    return prisma.payout
      .findMany({
        ...(args.paginate!),
        where: args.where as any
      });
  }
});
