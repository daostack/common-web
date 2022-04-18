import { Reputation } from "@/shared/models/Reputation"
import { GovernanceActions } from "./GovernanceActions"
import { GovernanceProposals } from "./GovernanceProposals"

export interface Circles {
  [key: string]: {
    readonly id: string
    reputation: Partial<Reputation>, // each property will be mapped to a validation function that recieves the value, i.e: minContribution(number) => number > minContributionNumber
    allowedActions: {
      [key in GovernanceActions]?: true
    },
    allowedProposals: {
      [key in GovernanceProposals]?: true
    }
  }
}
