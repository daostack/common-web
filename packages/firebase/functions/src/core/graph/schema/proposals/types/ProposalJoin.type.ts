import { objectType } from "nexus";

export const ProposalJoinType = objectType({
  name: 'ProposalJoin',
  definition(t) {
    t.nonNull.id('cardId');
    t.nonNull.int('funding');
    t.field('fundingType', {
      type: 'CommonContributionType',
    });
  },
});