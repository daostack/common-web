import { GovernanceConsequences } from "@/shared/constants";
import { BaseRule, Circles, Consequences } from "@/shared/models";
import { Actions, BaseAction } from "@/shared/models/governance/actions";
import { Proposals } from "@/shared/models/governance/proposals";

export interface CreateGovernance {
  circles: Circles[];
  actions: Partial<Record<keyof Actions, Pick<BaseAction, "cost">>>;
  proposals: Partial<Proposals>;
  consequences: Partial<
    Pick<Consequences, GovernanceConsequences.SUCCESSFUL_INVITATION>
  >;
  unstructuredRules: BaseRule[];
  tokenPool: number;
  commonId: string;
}
