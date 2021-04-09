import { inputObjectType } from 'nexus';

export const ProposalWhereInput = inputObjectType({
  name: 'ProposalWhereInput',
  definition(t) {
    t.field('type', {
      type: 'ProposalType'
    });
  }
});