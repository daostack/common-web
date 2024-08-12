import { lowerCase, startCase } from "lodash-es";
import { ProposalsTypes } from "@/shared/constants";
import { CommonMember, Governance } from "@/shared/models";
import { generateCirclesDataForCommonMember } from "./generateCircleDataForCommonMember";
import { commonTypeText } from "./text";

export const checkIsProposalTypeAllowedForMember = (
  commonMember: CommonMember,
  governance: Governance,
  proposalType: ProposalsTypes,
): boolean => {
  const allowedProposalValue = generateCirclesDataForCommonMember(
    governance.circles,
    commonMember.circleIds,
  ).allowedProposals[proposalType];

  if (typeof allowedProposalValue === "object") {
    return Object.values(allowedProposalValue).some((isAllowed) => isAllowed);
  }

  return allowedProposalValue || false;
};

export const getTextForProposalType = (
  proposalType: ProposalsTypes,
  isSubCommon = false,
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
    case ProposalsTypes.DELETE_COMMON:
      return `Delete ${commonTypeText(isSubCommon)}`;
    default:
      return startCase(lowerCase(proposalType));
  }
};
