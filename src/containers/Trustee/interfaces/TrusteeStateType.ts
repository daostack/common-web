import { LoadingState } from "@/shared/interfaces";
import { Proposal } from "@/shared/models";

export interface TrusteeStateType {
  pendingApprovalProposals: LoadingState<Proposal[]>;
  approvedProposals: LoadingState<Proposal[]>;
  declinedProposals: LoadingState<Proposal[]>;
  proposalForApproval: Proposal | null;
  isProposalForApprovalLoaded: boolean;
}
