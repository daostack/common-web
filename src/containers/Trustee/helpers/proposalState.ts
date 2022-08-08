import {
  FundsAllocation,
  FundingAllocationStatus,
} from "@/shared/models/governance/proposals";

export const checkPendingApprovalProposal = (
  proposal: FundsAllocation
): boolean =>
  proposal.data.tracker.status ===
  FundingAllocationStatus.PENDING_INVOICE_APPROVAL;

export const checkDeclinedProposal = (proposal: FundsAllocation): boolean =>
  proposal.data.legal.payoutDocsRejectionReason !== null &&
  proposal.data.tracker.status ===
    FundingAllocationStatus.PENDING_INVOICE_UPLOAD;
