import { objectType } from "nexus";

export const ProposalDescriptionType = objectType({
  name: 'ProposalDescription',
  definition(t) {
    t.string('title');
    t.nonNull.string('description');
  },
});