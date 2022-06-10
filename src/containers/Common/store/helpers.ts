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
        assignProposalDefinition: {
          global: {
            quorum: 30,
            weights: [
              {
                circles: [2, 1],
                value: 60,
              },
              {
                circles: [0],
                value: 40,
              },
            ],
            minApprove: 50,
            maxReject: 0,
            duration: 24,
          },
          local: {},
          limitations: {},
        },
        removeProposalDefinition: {
          global: {
            quorum: 30,
            weights: [
              {
                circles: [2, 1],
                value: 60,
              },
              {
                circles: [0],
                value: 40,
              },
            ],
            minApprove: 50,
            maxReject: 0,
            duration: 24,
          },
          local: {},
          limitations: {},
        },
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
        assignProposalDefinition: {
          global: {
            quorum: 30,
            weights: [
              {
                circles: [2, 1],
                value: 60,
              },
              {
                circles: [0],
                value: 40,
              },
            ],
            minApprove: 50,
            maxReject: 0,
            duration: 24,
          },
          local: {},
          limitations: {},
        },
        removeProposalDefinition: {
          global: {
            quorum: 30,
            weights: [
              {
                circles: [2, 1],
                value: 60,
              },
              {
                circles: [0],
                value: 40,
              },
            ],
            minApprove: 50,
            maxReject: 0,
            duration: 24,
          },
          local: {},
          limitations: {},
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
        assignProposalDefinition: {
          global: {
            quorum: 30,
            weights: [
              {
                circles: [2, 1],
                value: 60,
              },
              {
                circles: [0],
                value: 40,
              },
            ],
            minApprove: 50,
            maxReject: 0,
            duration: 24,
          },
          local: {},
          limitations: {},
        },
        removeProposalDefinition: {
          global: {
            quorum: 30,
            weights: [
              {
                circles: [2, 1],
                value: 60,
              },
              {
                circles: [0],
                value: 40,
              },
            ],
            minApprove: 50,
            maxReject: 0,
            duration: 24,
          },
          local: {},
          limitations: {},
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
              circles: [2, 1],
              value: 60,
            },
            {
              circles: [0],
              value: 40,
            },
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
      [ProposalsTypes.FUNDS_ALLOCATION]: {
        global: {
          quorum: 30,
          weights: [
            {
              circles: [2, 1],
              value: 60,
            },
            {
              circles: [0],
              value: 40,
            },
          ],
          minApprove: 50,
          maxReject: 0,
          duration: 0.02,
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
