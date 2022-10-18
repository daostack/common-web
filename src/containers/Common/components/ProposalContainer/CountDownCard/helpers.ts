import { Proposal, ProposalState } from "@/shared/models";
import { isFundsAllocationProposal } from "@/shared/models/governance/proposals";

export enum VotingStatus {
  Failing = "Failing",
  Passing = "Passing",
  Canceled = "Canceled",
  Rejected = "Rejected",
  Approved = "Approved",
  Withdrawn = "Withdrawn",
}

const calculateFinalState = (proposal: Proposal): ProposalState => {
  const {
    votes: {
      weightedApproved,
      weightedRejected,
      total,
      totalMembersWithVotingRight,
    },
    global: { maxReject, minApprove, quorum },
  } = proposal;

  if (!totalMembersWithVotingRight) {
    return ProposalState.FAILED;
  }

  if (minApprove === 0 && quorum === 0) {
    if (maxReject > 0 && weightedRejected <= maxReject)
      return ProposalState.PASSED;
    if (maxReject > 0 && weightedRejected > maxReject)
      return ProposalState.FAILED;
    if (maxReject === 0) return ProposalState.PASSED;
  }

  if (
    weightedRejected <= maxReject &&
    weightedRejected < weightedApproved &&
    weightedApproved >= minApprove &&
    total / totalMembersWithVotingRight > quorum / 100
  ) {
    return ProposalState.PASSED;
  }

  return ProposalState.FAILED;
};

export const calculateVotingStatus = (proposal: Proposal): VotingStatus => {
  switch (proposal.state) {
    case ProposalState.FAILED:
      return VotingStatus.Rejected;
    case ProposalState.RETRACTED:
      return VotingStatus.Canceled;
    case ProposalState.PASSED:
      return VotingStatus.Approved;
    case ProposalState.COMPLETED:
      return isFundsAllocationProposal(proposal)
        ? VotingStatus.Withdrawn
        : VotingStatus.Approved;
    default:
      return calculateFinalState(proposal) === ProposalState.PASSED
        ? VotingStatus.Passing
        : VotingStatus.Failing;
  }
};
