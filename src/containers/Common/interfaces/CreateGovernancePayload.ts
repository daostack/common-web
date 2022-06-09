import { GovernanceConsequences } from "@/shared/constants";
import { BaseRule, Circle, Consequences } from "@/shared/models";
import { Actions, BaseAction } from "@/shared/models/governance/actions";
import { BaseProposal, Proposals } from "@/shared/models/governance/proposals";

type CreateGovernanceWeights = {
  circles: number[];
  value: number;
}[];

type CreateGovernanceProposals = {
  [key in keyof Proposals]: Omit<Proposals[key], "global"> & {
    global: Omit<Proposals[key]["global"], "weights"> & {
      weights: CreateGovernanceWeights;
    };
  };
};

interface ProposalDefinition
  extends Pick<BaseProposal, "local" | "limitations"> {
  global: Omit<BaseProposal["global"], "weights"> & {
    weights: CreateGovernanceWeights;
  };
}

interface CreateGovernanceCircle extends Circle {
  assignProposalDefinition: ProposalDefinition;
  removeProposalDefinition: ProposalDefinition;
}

export interface CreateGovernancePayload {
  circles: CreateGovernanceCircle[];
  actions: Partial<Record<keyof Actions, Pick<BaseAction, "cost">>>;
  proposals: Partial<CreateGovernanceProposals>;
  consequences: Partial<
    Pick<Consequences, GovernanceConsequences.SUCCESSFUL_INVITATION>
  >;
  unstructuredRules: BaseRule[];
  tokenPool: number;
  commonId: string;
}
