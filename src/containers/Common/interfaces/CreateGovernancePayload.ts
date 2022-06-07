import { GovernanceConsequences } from "@/shared/constants";
import { BaseRule, Circle, Consequences } from "@/shared/models";
import { Actions, BaseAction } from "@/shared/models/governance/actions";
import { Proposals } from "@/shared/models/governance/proposals";

type CreateGovernanceProposals = {
  [key in keyof Proposals]: Omit<Proposals[key], "global"> & {
    global: Omit<Proposals[key]["global"], "weights"> & {
      weights: {
        circles: number[];
        value: number;
      }[];
    };
  };
};

export interface CreateGovernancePayload {
  circles: Circle[];
  actions: Partial<Record<keyof Actions, Pick<BaseAction, "cost">>>;
  proposals: Partial<CreateGovernanceProposals>;
  consequences: Partial<
    Pick<Consequences, GovernanceConsequences.SUCCESSFUL_INVITATION>
  >;
  unstructuredRules: BaseRule[];
  tokenPool: number;
  commonId: string;
}
