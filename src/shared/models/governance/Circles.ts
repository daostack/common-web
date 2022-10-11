import { GovernanceActions, ProposalsTypes } from "@/shared/constants";
import { Reputation } from "./Reputation";

export type AllowedActions = {
  [key in GovernanceActions]?: true;
};

export type AllowedProposals = {
  [ProposalsTypes.FUNDS_ALLOCATION]?: true;
  [ProposalsTypes.SURVEY]?: Partial<Record<CircleIndex, true>>;
  [ProposalsTypes.ASSIGN_CIRCLE]?: Partial<Record<string, true>>;
  [ProposalsTypes.REMOVE_CIRCLE]?: Partial<Record<string, true>>;
};

export type CircleIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19
  | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29
  | 30 | 31;

export type Circle = {
  name: string;
  reputation: Partial<Reputation>;
  id: string;
  allowedActions: AllowedActions;
  allowedProposals: AllowedProposals;
  hierarchy: {
    tier: number;
    exclusions: number[];
  } | null;
};

export type CirclesMap = {
  bin: number;
  map: {
    [key in CircleIndex]?: string;
  };
};

export type Circles = Partial<Record<CircleIndex, Circle>>;
