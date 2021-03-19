import { objectType } from 'nexus';

export const JoinProposalType = objectType({
  name: 'JoinProposal',
  definition(t) {
    t.implements('BaseEntity');
  }
});