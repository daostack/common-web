import { enumType } from "nexus";

export const ProposalVoteOutcomeEnum = enumType({
  name: 'ProposalVoteOutcome',
  members: [
    'approved',
    'rejected',
  ],
});
