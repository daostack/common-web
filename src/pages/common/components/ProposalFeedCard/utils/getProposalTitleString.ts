import { ProposalsTypes } from "@/shared/constants";

const PROPOSAL_TYPES_WITH_HIDDEN_TITLE = [ProposalsTypes.DELETE_COMMON];

export const getProposalTitleString = (
  proposalTitle: string,
  proposalType: ProposalsTypes,
): string => {
  return !PROPOSAL_TYPES_WITH_HIDDEN_TITLE.includes(proposalType)
    ? proposalTitle
    : "";
};
