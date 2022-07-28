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
