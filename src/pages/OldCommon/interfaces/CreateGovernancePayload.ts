import { GovernanceActions, ProposalsTypes } from "@/shared/constants";
import { BaseRule, Circle, CircleIndex, Timestamp } from "@/shared/models";
import {
  AllowedProposals,
  UnstructuredRules,
} from "@/shared/models/governance";
import { BaseProposal, Proposals } from "@/shared/models/governance/proposals";

type CreateGovernanceWeights = {
  circles: number[];
  value: number;
}[];

type CircleIndexToBooleanMap = Partial<Record<CircleIndex, boolean>>;

type CreateGovernanceProposalsKeys =
  | ProposalsTypes.MEMBER_ADMITTANCE
  | ProposalsTypes.FUNDS_ALLOCATION;

type CreateGovernanceProposals = {
  [key in CreateGovernanceProposalsKeys]: Omit<Proposals[key], "global"> & {
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

type CreateGovernanceCircleAllowedProposals = Omit<
  AllowedProposals,
  ProposalsTypes.ASSIGN_CIRCLE | ProposalsTypes.REMOVE_CIRCLE
> & {
  [ProposalsTypes.ASSIGN_CIRCLE]?: CircleIndexToBooleanMap;
  [ProposalsTypes.REMOVE_CIRCLE]?: CircleIndexToBooleanMap;
};

interface CreateGovernanceCircle
  extends Omit<Circle, "id" | "allowedProposals"> {
  allowedProposals: CreateGovernanceCircleAllowedProposals;
  assignProposalDefinition?: ProposalDefinition;
  removeProposalDefinition?: ProposalDefinition;
}

export interface CreateGovernancePayload {
  circles: CreateGovernanceCircle[];
  actions: Partial<Record<GovernanceActions, true>>;
  proposals: Partial<CreateGovernanceProposals>;
  unstructuredRules: BaseRule[];
  commonId: string;
}

export interface UpdateGovernanceRulesPayload {
  commonId: string;
  changes?: UnstructuredRules | { id: string }[];
  new?: BaseRule[];
  remove?: string[];
}

export interface UpdateGovernanceRulesData {
  changes?: UnstructuredRules | { id: string }[];
  new?: BaseRule[];
  remove?: string[];
  allRules: BaseRule[];
}

export interface UpdateGovernanceRulesResponse {
  message: string;
  unstructuredRules: UnstructuredRules;
  updatedAt: Timestamp;
}
