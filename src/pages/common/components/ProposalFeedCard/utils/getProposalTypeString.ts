import { ProposalsTypes } from "@/shared/constants";

const PROPOSAL_TYPE_TO_TEXT_MAP = {
  [ProposalsTypes.FUNDS_REQUEST]: "Funds request",
  [ProposalsTypes.FUNDS_ALLOCATION]: "Fund allocation",
  [ProposalsTypes.MEMBER_ADMITTANCE]: "Members admittance",
  [ProposalsTypes.ASSIGN_CIRCLE]: "Request to join circle",
  [ProposalsTypes.REMOVE_CIRCLE]: "Remove members from a circle",
  [ProposalsTypes.DELETE_COMMON]: "Delete space",
  [ProposalsTypes.SURVEY]: "Survey",
};

export const getProposalTypeString = (proposalType: ProposalsTypes): string =>
  PROPOSAL_TYPE_TO_TEXT_MAP[proposalType] || "";
