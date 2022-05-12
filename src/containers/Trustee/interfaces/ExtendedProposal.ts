import { Common, Proposal } from "@/shared/models";

export interface ExtendedProposal extends Proposal {
  common: Common;
}
