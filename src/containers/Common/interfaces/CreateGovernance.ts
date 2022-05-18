import { GovernanceActions } from "@/shared/constants";
import { Circles, CommonRule, Consequences } from "@/shared/models";
import { Proposals } from "@/shared/models/governance/proposals";

export interface CreateGovernance {
  circles: Circles[];
  actions: GovernanceActions;
  proposals: Proposals;
  consequences: Consequences;
  unstructuredRules: CommonRule[];
  tokenPool: number;
  commonId: string;
}
