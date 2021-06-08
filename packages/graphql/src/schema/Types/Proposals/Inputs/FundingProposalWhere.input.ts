import { inputObjectType } from 'nexus';

export const FundingProposalWhereInput = inputObjectType({
  name: 'FundingProposalWhereInput',
  definition(t) {
    t.field('fundingState', {
      type: 'FundingState'
    });
  }
});