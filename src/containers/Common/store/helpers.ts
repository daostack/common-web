import { GovernanceActions, ProposalsTypes } from "@/shared/constants";
import { CreateGovernancePayload } from "../interfaces";

export const createDefaultGovernanceCreationPayload = (
  settings: Pick<CreateGovernancePayload, "unstructuredRules" | "commonId">
): CreateGovernancePayload => {
  return {
    circles: [
      {
        name: "Member",
        reputation: {},
        allowedActions: {
          [GovernanceActions.CONTRIBUTE]: true,
          [GovernanceActions.CREATE_VOTE]: true,
          [GovernanceActions.CREATE_MESSAGE]: true,
          [GovernanceActions.CREATE_DISCUSSION]: true,
          [GovernanceActions.REPORT_PROPOSAL]: true,
          [GovernanceActions.REPORT_MESSAGE]: true,
          [GovernanceActions.REPORT_DISCUSSION]: true,
        },
        allowedProposals: {
          [ProposalsTypes.ASSIGN_CIRCLE]: { "1": true },
        },
      },
      {
        name: "Senior",
        reputation: {},
        allowedActions: {
          [GovernanceActions.CONTRIBUTE]: true,
          [GovernanceActions.RECEIVE_FUNDS]: true,
          [GovernanceActions.CREATE_VOTE]: true,
          [GovernanceActions.CREATE_MESSAGE]: true,
          [GovernanceActions.CREATE_DISCUSSION]: true,
          [GovernanceActions.REPORT_PROPOSAL]: true,
          [GovernanceActions.REPORT_MESSAGE]: true,
          [GovernanceActions.REPORT_DISCUSSION]: true,
          [GovernanceActions.DELETE_MESSAGE]: true,
          [GovernanceActions.DELETE_DISCUSSION]: true,
          [GovernanceActions.CREATE_PROPOSAL]: true,
        },
        allowedProposals: {
          [ProposalsTypes.ASSIGN_CIRCLE]: { "1": true, "2": true },
          [ProposalsTypes.REMOVE_CIRCLE]: { "1": true, "2": true },
          [ProposalsTypes.FUNDS_ALLOCATION]: true,
        },
        assignProposalDefinition: {
          global: {
            quorum: 25,
            weights: [{ circles: [2], value: 100 }],
            minApprove: 50,
            maxReject: 20,
            duration: 12,
          },
          local: {},
          limitations: {},
        },
        removeProposalDefinition: {
          global: {
            quorum: 25,
            weights: [{ circles: [2], value: 100 }],
            minApprove: 50,
            maxReject: 20,
            duration: 48,
          },
          local: {},
          limitations: {},
        },
      },
      {
        name: "Leader",
        reputation: {},
        allowedActions: {
          [GovernanceActions.CONTRIBUTE]: true,
          [GovernanceActions.RECEIVE_FUNDS]: true,
          [GovernanceActions.CREATE_VOTE]: true,
          [GovernanceActions.CREATE_MESSAGE]: true,
          [GovernanceActions.CREATE_DISCUSSION]: true,
          [GovernanceActions.REPORT_PROPOSAL]: true,
          [GovernanceActions.REPORT_MESSAGE]: true,
          [GovernanceActions.REPORT_DISCUSSION]: true,
          [GovernanceActions.DELETE_MESSAGE]: true,
          [GovernanceActions.DELETE_DISCUSSION]: true,
          [GovernanceActions.CREATE_PROPOSAL]: true,
        },
        allowedProposals: {
          [ProposalsTypes.ASSIGN_CIRCLE]: { "1": true, "2": true },
          [ProposalsTypes.REMOVE_CIRCLE]: { "1": true, "2": true },
          [ProposalsTypes.FUNDS_ALLOCATION]: true,
        },
        assignProposalDefinition: {
          global: {
            quorum: 25,
            weights: [{ circles: [2], value: 100 }],
            minApprove: 50,
            maxReject: 20,
            duration: 12,
          },
          local: {},
          limitations: {},
        },
        removeProposalDefinition: {
          global: {
            quorum: 25,
            weights: [{ circles: [2], value: 100 }],
            minApprove: 50,
            maxReject: 20,
            duration: 48,
          },
          local: {},
          limitations: {},
        },
      },
    ],
    actions: {
      [GovernanceActions.CREATE_MESSAGE]: true,
      [GovernanceActions.CREATE_DISCUSSION]: true,
      [GovernanceActions.REPORT_PROPOSAL]: true,
      [GovernanceActions.REPORT_MESSAGE]: true,
      [GovernanceActions.REPORT_DISCUSSION]: true,
      [GovernanceActions.DELETE_MESSAGE]: true,
      [GovernanceActions.DELETE_DISCUSSION]: true,
      [GovernanceActions.CREATE_PROPOSAL]: true,
    },
    proposals: {
      [ProposalsTypes.MEMBER_ADMITTANCE]: {
        global: {
          quorum: 0,
          weights: [{ circles: [2, 1], value: 100 }],
          minApprove: 0,
          maxReject: 20,
          duration: 8,
        },
        local: {
          defaultCircle: 0,
          optimisticAdmittance: false,
        },
        limitations: {},
      },
      [ProposalsTypes.FUNDS_ALLOCATION]: {
        global: {
          quorum: 10,
          weights: [{ circles: [2, 1], value: 100 }],
          minApprove: 50,
          maxReject: 33,
          duration: 36,
        },
        local: {},
        limitations: {},
      },
    },
    unstructuredRules: settings.unstructuredRules,
    commonId: settings.commonId,
  };
};
