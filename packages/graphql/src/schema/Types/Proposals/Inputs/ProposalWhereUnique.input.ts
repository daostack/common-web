import { inputObjectType } from 'nexus';

export const ProposalWhereUniqueInput = inputObjectType({
  name: 'ProposalWhereUniqueInput',
  definition(t) {
    t.nonNull.uuid('id');
  }
});