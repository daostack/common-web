import { Circles } from "@/shared/interfaces/governance/Circles";
import { Consequences } from "@/shared/interfaces/governance/Consequences";
import { GovernanceActions } from "@/shared/interfaces/governance/GovernanceActions";
import { GovernanceProposals } from "@/shared/interfaces/governance/GovernanceProposals";
import { CommonRule } from "@/shared/models";

export interface GovernanceCreate { 
  circles: Circles[];
  actions: GovernanceActions;
  proposals: GovernanceProposals;
  consequences: Consequences;
  unstructuredRules: CommonRule[];
  tokenPool: number;
  commonId: string;
}
