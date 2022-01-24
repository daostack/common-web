import { Proposal } from "../../../shared/models";

export interface TrusteeStateType {
  pendingApprovalProposals: Proposal[];
  arePendingApprovalProposalsLoaded: boolean;
  approvedProposals: Proposal[];
  areApprovedProposalsLoaded: boolean;
  declinedProposals: Proposal[];
  areDeclinedProposalsLoaded: boolean;
  proposalForApproval: Proposal | null;
  isProposalForApprovalLoaded: boolean;
}
