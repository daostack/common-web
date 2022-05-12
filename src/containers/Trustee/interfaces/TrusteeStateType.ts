import { LoadingState } from "@/shared/interfaces";
import { Common, Proposal } from "@/shared/models";

export interface TrusteeStateType {
  pendingApprovalProposals: LoadingState<Proposal[]>;
  approvedProposals: LoadingState<Proposal[]>;
  declinedProposals: LoadingState<Proposal[]>;
  commons: {
    ids: string[];
    data: Common[];
  };
  proposalForApproval: Proposal | null;
  isProposalForApprovalLoaded: boolean;
}
