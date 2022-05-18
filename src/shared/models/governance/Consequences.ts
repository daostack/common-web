import { GovernanceConsequences, Math } from "@/shared/constants";

export interface Consequences {
  [GovernanceConsequences.SUCCESSFUL_INVITATION]: {
    tokens: number;
    action: Math;
  };
  [GovernanceConsequences.POST_REPORTED]: {
    tokens: number;
    action: Math;
  };
  [GovernanceConsequences.PROPOSAL_ACCEPTED]: {
    tokens: number;
    action: Math;
  };
  [GovernanceConsequences.PROPOSAL_REJECTED]: {
    tokens: number;
    action: Math;
  };
  [GovernanceConsequences.CORRECT_VOTE]: {
    tokens: number;
    action: Math;
  };
  [GovernanceConsequences.WRONG_VOTE]: {
    tokens: number;
    action: Math;
  };
}
