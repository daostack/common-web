import { Common, Proposal, User } from "@/shared/models";

export interface ExtendedProposal extends Proposal {
  common?: Common;
  user?: User;
}
