import { lowerCase, startCase } from "lodash";
import { ProposalsTypes } from "@/shared/constants";
import { CommonMember } from "@/shared/models";

export const checkIsProposalTypeAllowedForMember = (
  commonMember: CommonMember,
  proposalType: ProposalsTypes
): boolean => {
  const allowedProposalValue = commonMember.allowedProposals[proposalType];

  if (typeof allowedProposalValue === "object") {
    return Object.values(allowedProposalValue).some((isAllowed) => isAllowed);
  }

  return allowedProposalValue || false;
};

export const getTextForProposalType = (
  proposalType: ProposalsTypes
): string => {
  switch (proposalType) {
    case ProposalsTypes.ASSIGN_CIRCLE:
      return "Assign members to a circle";
    case ProposalsTypes.FUNDS_ALLOCATION:
      return "Fund allocation";
    case ProposalsTypes.REMOVE_CIRCLE:
      return "Remove members from a circle";
    case ProposalsTypes.MEMBER_ADMITTANCE:
      return "Members admittance";
    default:
      return startCase(lowerCase(proposalType));
  }
};
