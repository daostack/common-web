import { ProposalsTypes } from "@/shared/constants";

export const getProposalDescriptionString = (
  proposalDescription: string,
  proposalType: ProposalsTypes,
): string => {
  switch (proposalType) {
    case ProposalsTypes.ASSIGN_CIRCLE:
      return "";
    default:
      return proposalDescription;
  }
};
