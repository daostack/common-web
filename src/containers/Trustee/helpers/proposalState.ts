import { FundingProcessStage, Proposal } from "../../../shared/models";

export const checkPendingApprovalProposal = (proposal: Proposal): boolean =>
  proposal.fundingProcessStage === FundingProcessStage.PendingInvoiceApproval;

export const checkDeclinedProposal = (proposal: Proposal): boolean =>
  Boolean(proposal.payoutDocsRejectionReason);
