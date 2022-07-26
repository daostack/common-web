import { Proposal, ProposalState } from "@/shared/models";
import { isFundsAllocationProposal } from "@/shared/models/governance/proposals";

export enum VotingStatus {
  Failing = "Failing",
  Passing = "Passing",
  Rejected = "Rejected",
  Approved = "Approved",
  Withdrawn = "Withdrawn",
}

const calculateFinalState = (
  proposal: Proposal,
  memberCount: number
): ProposalState => {
  const {
    votes: { weightedApproved, weightedRejected, total },
    global: { maxReject, minApprove, quorum },
  } = proposal;

  if (
    weightedRejected <= maxReject &&
    weightedRejected < weightedApproved &&
    weightedApproved > minApprove &&
    total / memberCount > quorum / 100
  ) {
    return ProposalState.PASSED;
  }

  return ProposalState.FAILED;
};

export const calculateVotingStatus = (
  proposal: Proposal,
  memberCount: number
): VotingStatus => {
  switch (proposal.state) {
    case ProposalState.FAILED:
    case ProposalState.RETRACTED:
      return VotingStatus.Rejected;
    case ProposalState.PASSED:
      return VotingStatus.Approved;
    case ProposalState.COMPLETED:
      return isFundsAllocationProposal(proposal)
        ? VotingStatus.Withdrawn
        : VotingStatus.Approved;
    default:
      return calculateFinalState(proposal, memberCount) === ProposalState.PASSED
        ? VotingStatus.Passing
        : VotingStatus.Failing;
  }
};
