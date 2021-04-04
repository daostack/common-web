import { inputObjectType } from 'nexus';

export const ProposalFileInput = inputObjectType({
  name: 'ProposalFileInput',
  definition(t) {
    t.nonNull.string('value');
  }
});