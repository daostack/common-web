import { objectType } from "nexus";

export const ProposalFundingType = objectType({
  name: 'ProposalFunding',
  definition(t) {
    t.nonNull.int('amount');
  },
});
