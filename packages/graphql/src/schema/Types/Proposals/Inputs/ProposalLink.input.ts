import { inputObjectType } from 'nexus';

export const ProposalLinkInput = inputObjectType({
  name: 'ProposalLinkInput',
  definition(t) {
    t.nonNull.string('title');
    t.nonNull.string('url');
  }
});