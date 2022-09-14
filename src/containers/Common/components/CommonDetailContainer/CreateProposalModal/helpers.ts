import { ProposalsTypes } from "@/shared/constants";
import { CreateProposalStage } from "./constants";

export const getStageByProposalType = (
  proposalType?: ProposalsTypes
): CreateProposalStage | null => {
  switch (proposalType) {
    case ProposalsTypes.ASSIGN_CIRCLE:
      return CreateProposalStage.AssignCircle;
    case ProposalsTypes.FUNDS_ALLOCATION:
      return CreateProposalStage.FundsAllocation;
    case ProposalsTypes.REMOVE_CIRCLE:
      return CreateProposalStage.RemoveCircle;
    case ProposalsTypes.SURVEY:
      return CreateProposalStage.Survey;
    default:
      return null;
  }
};
