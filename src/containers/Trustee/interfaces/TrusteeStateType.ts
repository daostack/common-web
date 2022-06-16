import { LoadingState } from "@/shared/interfaces";
import { Common, User } from "@/shared/models";
import { FundsAllocation } from "@/shared/models/governance/proposals";

export interface TrusteeStateType {
  pendingApprovalProposals: LoadingState<FundsAllocation[]>;
  approvedProposals: LoadingState<FundsAllocation[]>;
  declinedProposals: LoadingState<FundsAllocation[]>;
  commons: {
    ids: string[];
    data: Common[] | null;
  };
  users: {
    ids: string[];
    data: User[] | null;
  };
  proposalForApproval: FundsAllocation | null;
  isProposalForApprovalLoaded: boolean;
}
