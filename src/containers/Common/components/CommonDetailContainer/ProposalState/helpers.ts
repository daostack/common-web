import { Proposal, ProposalState as ProposalStateTypes } from "@/shared/models";
import {
  FundingAllocationStatus,
  isFundsAllocationProposal,
} from "@/shared/models/governance/proposals";

export const getProposalState = (proposal: Proposal): string => {
  switch (proposal.state) {
    case ProposalStateTypes.FAILED:
      return "Rejected";
    case ProposalStateTypes.RETRACTED:
      return "Canceled";
    default:
      break;
  }

  const isUnclaimedProposal =
    isFundsAllocationProposal(proposal) &&
    proposal.data.tracker.status ===
      FundingAllocationStatus.EXPIRED_INVOICES_NOT_UPLOADED;

  return isUnclaimedProposal ? "Unclaimed" : "Approved";
};
