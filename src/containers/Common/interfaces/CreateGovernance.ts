import { GovernanceActions } from "@/shared/constants";
import { BaseRule, Circles, Consequences } from '@/shared/models';
import { Proposals } from "@/shared/models/governance/proposals";

export interface CreateGovernance {
  circles: Circles[];
  actions: GovernanceActions;
  proposals: Proposals;
  consequences: Consequences;
  unstructuredRules: BaseRule[];
  tokenPool: number;
  commonId: string;
}
