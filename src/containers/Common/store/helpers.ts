import { GovernanceActions, ProposalsTypes } from "@/shared/constants";
import { CreateGovernancePayload } from "../interfaces";

export const createDefaultGovernanceCreationPayload = (
  settings: Pick<CreateGovernancePayload, "unstructuredRules" | "commonId">
): CreateGovernancePayload => {
  return {
    circles: [
      {
        name: "FOLLOWER",
        reputation: {},
        allowedActions: {},
        allowedProposals: {},
      },
      {
        name: "STANDARD_MEMBER",
        reputation: {},
        allowedActions: {
          [GovernanceActions.CREATE_PROPOSAL]: true,
        },
        allowedProposals: {
          [ProposalsTypes.MEMBER_ADMITTANCE]: true,
        },
      },
      {
        name: "COMMON_LEADER",
        reputation: {},
        allowedActions: {
          [GovernanceActions.CREATE_PROPOSAL]: true,
        },
        allowedProposals: {
          [ProposalsTypes.MEMBER_ADMITTANCE]: true,
        },
      },
    ],
    actions: {
      [GovernanceActions.CREATE_PROPOSAL]: {
        cost: 0,
      },
    },
    proposals: {
      [ProposalsTypes.MEMBER_ADMITTANCE]: {
        global: {
          quorum: 30,
          weights: [
            { circles: [2], value: 60 },
            { circles: [1], value: 30 },
            { circles: [0], value: 10 },
          ],
          minApprove: 50,
          maxReject: 0,
          duration: 24,
        },
        local: {
          defaultCircle: 1,
          optimisticAdmittance: true,
        },
        limitations: {},
      },
    },
    consequences: {},
    unstructuredRules: settings.unstructuredRules,
    tokenPool: 0,
    commonId: settings.commonId,
  };
};
