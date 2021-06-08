import { queryField, nonNull, idArg } from 'nexus';
import { prisma, authorizationService } from '@common/core';

export const GetPayoutQuery = queryField('payout', {
  type: 'Payout',
  args: {
    id: nonNull(idArg())
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.financials.payouts.read');
  },
  resolve: (root, args) => {
    return prisma.payout
      .findUnique({
        where: {
          id: args.id
        }
      });
  }
});