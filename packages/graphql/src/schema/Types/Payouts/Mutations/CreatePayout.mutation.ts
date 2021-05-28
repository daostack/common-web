import { mutationField, inputObjectType, nonNull, arg } from 'nexus';
import { authorizationService, payoutsService } from '@common/core';

const CreatePayoutInput = inputObjectType({
  name: 'CreatePayoutInput',
  definition(t) {
    t.nonNull.id('wireId');
    t.nonNull.list.nonNull.id('proposalIds');

    t.string('description');
  }
});

export const CreatePayoutMutation = mutationField('createPayout', {
  type: 'Payout',
  args: {
    input: nonNull(
      arg({
        type: CreatePayoutInput
      })
    )
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.financials.payouts.create');
  },
  resolve: (root, args) => {
    return payoutsService.create(args.input);
  }
});