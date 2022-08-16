import { lowerCase, startCase } from "lodash";
import { GovernanceActions, ProposalsTypes } from "@/shared/constants";
import { AllowedActions } from "@/shared/models";

export const getTextForProposalType = (
  proposalType: ProposalsTypes
): string => {
  switch (proposalType) {
    case ProposalsTypes.ASSIGN_CIRCLE:
      return "Assign members to circle";
    case ProposalsTypes.FUNDS_ALLOCATION:
      return "Fund allocation";
    case ProposalsTypes.REMOVE_CIRCLE:
      return "Remove members from circle";
    case ProposalsTypes.MEMBER_ADMITTANCE:
      return "Members admittance";
    default:
      return startCase(lowerCase(proposalType));
  }
};

export const checkShouldRemoveAction = (
  action: keyof AllowedActions
): boolean =>
  [
    GovernanceActions.CREATE_PROPOSAL,
    GovernanceActions.CREATE_VOTE,
    GovernanceActions.RECEIVE_REPORT_DISCUSSION_NOTIFICATION,
    GovernanceActions.RECEIVE_REPORT_MESSAGE_NOTIFICATION,
    GovernanceActions.RECEIVE_REPORT_PROPOSAL_NOTIFICATION,
  ].includes(action);

export const getTextForAction = (action: keyof AllowedActions): string => {
  switch (action) {
    case GovernanceActions.CONTRIBUTE:
      return "Contribute funds";
    case GovernanceActions.CREATE_DISCUSSION:
      return "Create a discussion";
    case GovernanceActions.CREATE_MESSAGE:
      return "Write a message";
    case GovernanceActions.REPORT_DISCUSSION:
      return "Report a discussion";
    case GovernanceActions.REPORT_MESSAGE:
      return "Report a message";
    case GovernanceActions.REPORT_PROPOSAL:
      return "Report a proposal";
    case GovernanceActions.HIDE_OR_UNHIDE_DISCUSSION:
      return "Hide a discussion";
    case GovernanceActions.HIDE_OR_UNHIDE_MESSAGE:
      return "Hide a message";
    case GovernanceActions.HIDE_OR_UNHIDE_PROPOSAL:
      return "Hide a proposal";
    case GovernanceActions.DELETE_DISCUSSION:
      return "Delete a discussion";
    case GovernanceActions.DELETE_MESSAGE:
      return "Delete a message";
    case GovernanceActions.RECEIVE_FUNDS:
      return "Receive funds";
    default:
      return startCase(lowerCase(action));
  }
};
