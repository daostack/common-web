import { GovernanceActions } from "@/shared/constants";
import { CreateProposal } from "./CreateProposal";

export interface Actions {
  [GovernanceActions.CREATE_PROPOSAL]: CreateProposal;
  // Expended for each action
}
