import { GovernanceConsequences, Math } from "@/shared/constants";

export interface Consequences {
  [GovernanceConsequences.SuccessfulInvitation]: {
    tokens: number;
    action: Math;
  };
  [GovernanceConsequences.PostReported]: {
    tokens: number;
    action: Math;
  };
  [GovernanceConsequences.ProposalAccepted]: {
    tokens: number;
    action: Math;
  };
  [GovernanceConsequences.ProposalRejected]: {
    tokens: number;
    action: Math;
  };
  [GovernanceConsequences.CorrectVote]: {
    tokens: number;
    action: Math;
  };
  [GovernanceConsequences.WrongVote]: {
    tokens: number;
    action: Math;
  };
}
