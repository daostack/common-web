import { Proposal, ProposalState } from "@/shared/models";
import {
  FundingAllocationStatus,
  isFundsAllocationProposal,
} from "@/shared/models/governance/proposals";

export const getProposalState = (proposal: Proposal): string => {
  if (
    isFundsAllocationProposal(proposal) &&
    proposal.data.tracker.status ===
      FundingAllocationStatus.EXPIRED_INVOICES_NOT_UPLOADED
  ) {
    return "Unclaimed";
  }

  switch (proposal.state) {
    case ProposalState.FAILED:
      return "Rejected";
    case ProposalState.RETRACTED:
      return "Canceled";
    case ProposalState.COMPLETED:
      if (isFundsAllocationProposal(proposal)) {
        return "Withdrawn";
      }

      break;
    default:
      break;
  }

  return "Approved";
};
