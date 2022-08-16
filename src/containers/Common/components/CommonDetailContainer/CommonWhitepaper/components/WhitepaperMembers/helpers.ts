import { lowerCase, startCase } from "lodash";
import { ProposalsTypes } from "@/shared/constants";
import { AllowedProposals } from "@/shared/models";

export const getTextForProposalType = (
  proposalType: keyof AllowedProposals
): string => {
  switch (proposalType) {
    case ProposalsTypes.ASSIGN_CIRCLE:
      return "Assign members to circle";
    default:
      return startCase(lowerCase(proposalType));
  }
};
