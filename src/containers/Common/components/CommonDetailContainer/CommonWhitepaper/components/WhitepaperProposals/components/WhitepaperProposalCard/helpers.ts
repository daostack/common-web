import { ProposalsTypes } from "@/shared/constants";
import { lowerCase, startCase } from "lodash";

export const getTextForProposalType = (
  proposalType: ProposalsTypes
): string => {
  switch (proposalType) {
    case ProposalsTypes.ASSIGN_CIRCLE:
      return "Assign a member to a circle";
    case ProposalsTypes.FUNDS_ALLOCATION:
      return "Fund Allocation";
    case ProposalsTypes.REMOVE_CIRCLE:
      return "Remove a member from a circle";
    default:
      return startCase(lowerCase(proposalType));
  }
};
