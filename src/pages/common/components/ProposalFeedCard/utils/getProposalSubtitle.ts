import { ReactNode } from "react";
import { ProposalsTypes } from "@/shared/constants";
import { Proposal } from "@/shared/models";
import { FundsAllocation } from "@/shared/models/governance/proposals";
import { formatPriceEntrance, getUserName } from "@/shared/utils";
import { ProposalSpecificData } from "../types";

const getSubtitleForFundsAllocation = (
  fundsAllocation: FundsAllocation,
  proposalSpecificData: ProposalSpecificData,
): ReactNode => {
  const formattedPrice = formatPriceEntrance(fundsAllocation.data.args.amount);

  if (proposalSpecificData.targetUser) {
    return `${formattedPrice} for ${getUserName(
      proposalSpecificData.targetUser,
    )}`;
  }

  return formattedPrice;
};

export const getProposalSubtitle = (
  proposal: Proposal,
  proposalSpecificData: ProposalSpecificData,
): ReactNode => {
  switch (proposal.type) {
    case ProposalsTypes.FUNDS_ALLOCATION:
      return getSubtitleForFundsAllocation(proposal, proposalSpecificData);
    default:
      return null;
  }
};
