import { ProposalOutcomeUnit } from "@/shared/constants";

export const getProjectCircleDefinition = (
  name: string,
  highestCircleId: string,
) => ({
  name,
  allowedActions: {},
  allowedProposals: {},
  assignProposalDefinition: {
    global: {
      quorum: 0,
      weights: [{ circles: [highestCircleId], value: 100 }],
      minApprove: 0,
      minApproveUnit: ProposalOutcomeUnit.Percent,
      maxReject: 67,
      maxRejectUnit: ProposalOutcomeUnit.Percent,
      votingDuration: 0,
      discussionDuration: 0,
    },
    local: {},
    limitations: {},
  },
  removeProposalDefinition: {
    global: {
      quorum: 25,
      weights: [{ circles: [highestCircleId], value: 100 }],
      minApprove: 50,
      minApproveUnit: ProposalOutcomeUnit.Percent,
      maxReject: 50,
      maxRejectUnit: ProposalOutcomeUnit.Percent,
      votingDuration: 48,
      discussionDuration: 48,
    },
    local: {},
    limitations: {},
  },
  hierarchy: null,
});
