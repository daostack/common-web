import { inputObjectType } from 'nexus';

export const ExecutePayoutsInput = inputObjectType({
  name: 'ExecutePayoutInput',
  definition(t) {
    t.nonNull.id('wireId', {
      description: 'The ID of the the wire to witch the payout will be made'
    });

    t.nonNull.list.nonNull.id('proposalIds', {
      description: 'List of the all proposals IDs that are in this batch'
    });
  }
});