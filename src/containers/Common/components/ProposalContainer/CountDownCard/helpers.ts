import { ProposalState } from "@/shared/models";

export const calculateProposalStatus = (state: ProposalState): string => {
  if (state === ProposalState.FAILED) {
    return "Rejected";
  }

  return "Passing";
};
