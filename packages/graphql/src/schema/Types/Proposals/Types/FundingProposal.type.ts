import { objectType } from 'nexus';

export const FundingProposalType = objectType({
  name: 'FundingProposal',
  definition(t) {
    t.implements('BaseEntity');

    t.nonNull.int('amount', {
      description: 'The amount that the proposal has requested in cents'
    });

    t.nonNull.field('fundingState', {
      type: 'FundingState'
    });
  }
});