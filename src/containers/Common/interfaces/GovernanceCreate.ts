import { Circles } from "@/shared/interfaces/governance/Circles";
import { Consequences } from "@/shared/interfaces/governance/Consequences";
import { GovernanceActions } from "@/shared/interfaces/governance/GovernanceActions";
import { Proposals } from "@/shared/interfaces/Proposals";
import { CommonRule } from "@/shared/models";

export interface GovernanceCreate { 
  circles: Circles[];
  actions: GovernanceActions;
  proposals: Proposals;
  consequences: Consequences;
  unstructuredRules: CommonRule[];
  tokenPool: number;
  commonId: string;
}
