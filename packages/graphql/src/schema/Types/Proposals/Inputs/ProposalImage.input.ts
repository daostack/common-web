import { inputObjectType } from 'nexus';

export const ProposalImageInput = inputObjectType({
  name: 'ProposalImageInput',
  definition(t) {
    t.nonNull.string('value');
  }
});