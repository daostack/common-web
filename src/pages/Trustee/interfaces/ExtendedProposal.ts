import { Common, User } from "@/shared/models";
import { FundsAllocation } from "@/shared/models/governance/proposals";

export interface ExtendedProposal {
  proposal: FundsAllocation;
  common?: Common;
  user?: User;
}
