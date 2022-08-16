import { lowerCase, startCase } from "lodash";
import { GovernanceActions, ProposalsTypes } from "@/shared/constants";
import { AllowedActions, AllowedProposals } from "@/shared/models";

export const getTextForProposalType = (
  proposalType: keyof AllowedProposals
): string => {
  switch (proposalType) {
    case ProposalsTypes.ASSIGN_CIRCLE:
      return "Assign members to circle";
    case ProposalsTypes.FUNDS_ALLOCATION:
      return "Fund Allocation";
    default:
      return startCase(lowerCase(proposalType));
  }
};

export const checkShouldRemoveAction = (
  action: keyof AllowedActions
): boolean =>
  [GovernanceActions.CREATE_PROPOSAL, GovernanceActions.CREATE_VOTE].includes(
    action
  );

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
    default:
      return startCase(lowerCase(action));
  }
};
