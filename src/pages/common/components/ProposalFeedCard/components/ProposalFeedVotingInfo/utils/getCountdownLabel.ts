import { Proposal, ProposalState } from "@/shared/models";

export const getCountdownLabel = (
  proposalState: Proposal["state"],
  isCountdownFinished: boolean,
): string => {
  if (proposalState === ProposalState.DISCUSSION) {
    return "Voting starts in";
  }

  return isCountdownFinished ? "Voting ended" : "Time to Vote";
};
