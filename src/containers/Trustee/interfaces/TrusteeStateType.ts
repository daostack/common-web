import { LoadingState } from "@/shared/interfaces";
import { Common, Proposal, User } from "@/shared/models";

export interface TrusteeStateType {
  pendingApprovalProposals: LoadingState<Proposal[]>;
  approvedProposals: LoadingState<Proposal[]>;
  declinedProposals: LoadingState<Proposal[]>;
  commons: {
    ids: string[];
    data: Common[] | null;
  };
  users: {
    ids: string[];
    data: User[] | null;
  };
  proposalForApproval: Proposal | null;
  isProposalForApprovalLoaded: boolean;
}
