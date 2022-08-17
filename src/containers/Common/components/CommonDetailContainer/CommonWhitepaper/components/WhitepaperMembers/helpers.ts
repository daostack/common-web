import { lowerCase, startCase } from "lodash";
import { GovernanceActions } from "@/shared/constants";
import { AllowedActions } from "@/shared/models";

export const checkShouldRemoveAction = (
  action: keyof AllowedActions
): boolean =>
  [
    GovernanceActions.CREATE_PROPOSAL,
    GovernanceActions.CREATE_VOTE,
    GovernanceActions.RECEIVE_REPORT_DISCUSSION_NOTIFICATION,
    GovernanceActions.RECEIVE_REPORT_MESSAGE_NOTIFICATION,
    GovernanceActions.RECEIVE_REPORT_PROPOSAL_NOTIFICATION,
    GovernanceActions.REPORT_DISCUSSION,
    GovernanceActions.REPORT_PROPOSAL,
    GovernanceActions.HIDE_OR_UNHIDE_DISCUSSION,
    GovernanceActions.HIDE_OR_UNHIDE_PROPOSAL,
    GovernanceActions.DELETE_DISCUSSION,
    GovernanceActions.DELETE_MESSAGE,
  ].includes(action);

export const getTextForAction = (action: keyof AllowedActions): string => {
  switch (action) {
    case GovernanceActions.CONTRIBUTE:
      return "Contribute funds";
    case GovernanceActions.CREATE_DISCUSSION:
      return "Create a discussion";
    case GovernanceActions.CREATE_MESSAGE:
      return "Write a message";
    case GovernanceActions.REPORT_MESSAGE:
      return "Report a message";
    case GovernanceActions.HIDE_OR_UNHIDE_MESSAGE:
      return "Hide a message";
    case GovernanceActions.RECEIVE_FUNDS:
      return "Receive funds";
    default:
      return startCase(lowerCase(action));
  }
};
