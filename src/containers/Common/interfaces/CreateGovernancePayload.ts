import { GovernanceConsequences } from "@/shared/constants";
import { BaseRule, Circle, Consequences } from "@/shared/models";
import { Actions, BaseAction } from "@/shared/models/governance/actions";
import { Proposals } from "@/shared/models/governance/proposals";

interface CreateGovernanceCircle extends Omit<Circle, "id"> {
  id: string;
}

export interface CreateGovernancePayload {
  circles: CreateGovernanceCircle[];
  actions: Partial<Record<keyof Actions, Pick<BaseAction, "cost">>>;
  proposals: Partial<Proposals>;
  consequences: Partial<
    Pick<Consequences, GovernanceConsequences.SUCCESSFUL_INVITATION>
  >;
  unstructuredRules: BaseRule[];
  tokenPool: number;
  commonId: string;
}
