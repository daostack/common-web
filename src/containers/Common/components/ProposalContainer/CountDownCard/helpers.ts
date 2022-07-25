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
  if (
    [ProposalState.FAILED, ProposalState.RETRACTED].includes(proposal.state)
  ) {
    return VotingStatus.Rejected;
  }
  if (proposal.state === ProposalState.PASSED) {
    return VotingStatus.Approved;
  }
  if (proposal.state === ProposalState.COMPLETED) {
    return isFundsAllocationProposal(proposal)
      ? VotingStatus.Withdrawn
      : VotingStatus.Approved;
  }

  return calculateFinalState(proposal, memberCount) === ProposalState.PASSED
    ? VotingStatus.Passing
    : VotingStatus.Failing;
};
