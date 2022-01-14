import { Proposal } from "../../../shared/models";

export interface TrusteeStateType {
  pendingApprovalProposals: Proposal[];
  arePendingApprovalProposalsLoaded: boolean;
  approvedProposals: Proposal[];
  areApprovedProposalLoaded: boolean;
  declinedProposals: Proposal[];
  areDeclinedProposalsLoaded: boolean;
}
