import { GovernanceActions, ProposalsTypes } from "@/shared/constants";
import { Reputation } from "./Reputation";

export type AllowedActions = {
  [key in GovernanceActions]?: true;
};

export type AllowedProposals = {
  [ProposalsTypes.FUNDS_ALLOCATION]?: true;
  [ProposalsTypes.ASSIGN_CIRCLE]?: Partial<Record<circleIndex, true>>;
  [ProposalsTypes.REMOVE_CIRCLE]?: Partial<Record<circleIndex, true>>;
};

export type circleIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19
  | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29
  | 30 | 31;

export interface Circle {
  name: string;
  reputation: Partial<Reputation>; // each property will be mapped to a validation function that recieves the value, i.e: minContribution(number) => number > minContributionNumber
  id: string;
  allowedActions: AllowedActions;
  allowedProposals: AllowedProposals;
}

export type Circles = Circle[];
