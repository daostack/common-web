export const getProjectCircleDefinition = (name: string) => ({
  name,
  allowedActions: {},
  allowedProposals: {},
  assignProposalDefinition: {
    global: {
      quorum: 0,
      weights: [{ circles: [2], value: 100 }],
      minApprove: 0,
      maxReject: 67,
      votingDuration: 0,
      discussionDuration: 0,
    },
    local: {},
    limitations: {},
  },
  removeProposalDefinition: {
    global: {
      quorum: 25,
      weights: [{ circles: [2], value: 100 }],
      minApprove: 50,
      maxReject: 50,
      votingDuration: 48,
      discussionDuration: 48,
    },
    local: {},
    limitations: {},
  },
  hierarchy: {
    tier: null,
    exclusions: [],
  },
});
