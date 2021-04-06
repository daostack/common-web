import { createJoinProposalCommand } from './join/command/createJoinProposalCommand';
import { processApprovedOneTimeJoinRequestCommand } from './join/command/process/processApprovedOneTimeJoinRequest';
import { processApprovedSubscriptionJoinRequest } from './join/command/process/processApprovedSubscriptionJoinRequest';

import { createFundingProposalCommand } from './funding/command/createFundingProposalCommand';
import { processApprovedFundingRequest } from './funding/command/process/processApprovedFundingRequest';
import { processRejectedFundingRequest } from './funding/command/process/processRejectedFundingRequest';

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

  // Shared commands and queries
  updateVoteCount: updateProposalVoteCountsCommand,
  finalize: finalizeProposalCommand,

  hasMajority: proposalHasMajorityQuery
};