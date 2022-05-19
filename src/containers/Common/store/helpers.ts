import { GovernanceActions, ProposalsTypes } from "@/shared/constants";
import { CreateGovernancePayload } from "../interfaces";

export const createDefaultGovernanceCreationPayload = (
  settings: Pick<CreateGovernancePayload, "unstructuredRules" | "commonId">
): CreateGovernancePayload => {
  return {
    circles: [
      {
        id: "b5ac9ddf-a916-4c10-b712-ddc31103ecc3",
        name: "FOLLOWER",
        reputation: {},
        allowedActions: {},
        allowedProposals: {},
      },
      {
        id: "70c0da4f-aa0d-46f4-ae96-6ee4bf9bac7f",
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
        id: "29c3fba9-74c8-48aa-b850-d04a2718356f",
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
            {
              circles: ["29c3fba9-74c8-48aa-b850-d04a2718356f"],
              value: 60,
            },
            {
              circles: ["70c0da4f-aa0d-46f4-ae96-6ee4bf9bac7f"],
              value: 30,
            },
            {
              circles: ["b5ac9ddf-a916-4c10-b712-ddc31103ecc3"],
              value: 10,
            },
          ],
          minApprove: 50,
          maxReject: 0,
          duration: 24,
        },
        local: {
          defaultCircle: "29c3fba9-74c8-48aa-b850-d04a2718356f",
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
