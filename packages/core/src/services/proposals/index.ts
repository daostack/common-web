import { createJoinProposalCommand } from './join/command/createJoinProposalCommand';
import { createFundingProposalCommand } from './funding/command/createFundingProposalCommand';

import { updateProposalVoteCountsCommand } from './shared/command/updateProposalVoteCountsCommand';
import { proposalHasMajorityQuery } from './shared/queries/proposalHasMajorityQuery';
import { finalizeProposalCommand } from './shared/command/finalizeProposalCommand';
import { processApprovedOneTimeJoinRequestCommand } from './join/command/process/processApprovedOneTimeJoinRequest';

export const joinProposalService = {
  commands: {
    create: createJoinProposalCommand
  },

  process: {
    approvedJoinRequest: null,

    approvedOneTimeJoinRequest: processApprovedOneTimeJoinRequestCommand,
    approvedSubscriptionJoinRequest: null // @todo
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
  finalize: finalizeProposalCommand,

  hasMajority: proposalHasMajorityQuery
};