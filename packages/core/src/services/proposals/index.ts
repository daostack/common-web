import { createJoinProposalCommand } from './commands/join/createJoinProposalCommand';
import { processApprovedOneTimeJoinRequestCommand } from './commands/join/process/processApprovedOneTimeJoinRequest';
import { processApprovedSubscriptionJoinRequest } from './commands/join/process/processApprovedSubscriptionJoinRequest';

import { createFundingProposalCommand } from './commands/funding/createFundingProposalCommand';
import { processApprovedFundingRequest } from './commands/funding/process/processApprovedFundingRequest';
import { processRejectedFundingRequest } from './commands/funding/process/processRejectedFundingRequest';

import { finalizeProposalCommand } from './shared/command/finalizeProposalCommand';
import { proposalHasMajorityQuery } from './shared/queries/proposalHasMajorityQuery';
import { updateProposalVoteCountsCommand } from './shared/command/updateProposalVoteCountsCommand';

export const joinProposalService = {
  create: createJoinProposalCommand,

  process: {
    approvedOneTime: processApprovedOneTimeJoinRequestCommand,
    approvedSubscription: processApprovedSubscriptionJoinRequest
  }
};

export const fundingProposalService = {
  create: createFundingProposalCommand,

  process: {
    approved: processApprovedFundingRequest,
    rejected: processRejectedFundingRequest
  }
};

export const proposalService = {
  join: joinProposalService,
  funding: fundingProposalService,

  // Shared commands and Queries
  updateVoteCount: updateProposalVoteCountsCommand,
  finalize: finalizeProposalCommand,

  hasMajority: proposalHasMajorityQuery
};