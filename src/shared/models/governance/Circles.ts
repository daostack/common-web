import { GovernanceActions, ProposalsTypes } from "@/shared/constants";
import { Reputation } from "./Reputation";

export interface Circles {
  [key: string]: {
    readonly id: string;
    reputation: Partial<Reputation>; // each property will be mapped to a validation function that recieves the value, i.e: minContribution(number) => number > minContributionNumber
    allowedActions: {
      [key in GovernanceActions]?: true;
    };
    allowedProposals: {
      [key in ProposalsTypes]?: true;
    };
  };
}
