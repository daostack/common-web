import { mutationField, nonNull, idArg, arg } from 'nexus';
import { authorizationService, payoutsService } from '@common/core';

export const ApprovePayoutMutation = mutationField('approvePayout', {
  type: 'PayoutApprover',
  args: {
    payoutId: nonNull(idArg()),
    outcome: nonNull(
      arg({
        type: 'PayoutApproverResponse'
      })
    )
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.financials.payouts.confirm');
  },
  resolve: async (root, args, ctx) => {
    return payoutsService.approve({
      ...args,
      userId: await ctx.getUserId()
    });
  }
});