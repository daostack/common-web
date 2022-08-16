import { ProposalsTypes } from "@/shared/constants";
import { lowerCase, startCase } from "lodash";

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
