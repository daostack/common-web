import { createJoinProposalCommand } from './join/command/createJoinProposalCommand';
import { createFundingProposalCommand } from './funding/command/createFundingProposalCommand';

import { updateProposalVoteCountsCommand } from './shared/command/updateProposalVoteCountsCommand';
import { proposalHasMajorityQuery } from './shared/queries/proposalHasMajorityQuery';

export const joinProposalService = {
  commands: {
    create: createJoinProposalCommand
  }
};

export const fundingProposalService = {
  create: createFundingProposalCommand
};

export const proposalsService = {
  join: joinProposalService,
  funding: fundingProposalService,

  // Shared commands and queries
  updateVoteCount: updateProposalVoteCountsCommand,

  hasMajority: proposalHasMajorityQuery
};