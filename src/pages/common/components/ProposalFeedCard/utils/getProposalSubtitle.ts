import { ReactNode } from "react";
import { ProposalsTypes } from "@/shared/constants";
import { Proposal } from "@/shared/models";
import { FundsAllocation } from "@/shared/models/governance/proposals";
import { formatPriceEntrance } from "@/shared/utils";

const getSubtitleForFundsAllocation = (
  fundsAllocation: FundsAllocation,
): ReactNode => {
  const formattedPrice = formatPriceEntrance(fundsAllocation.data.args.amount);

  return formattedPrice;
};

export const getProposalSubtitle = (proposal: Proposal): ReactNode => {
  switch (proposal.type) {
    case ProposalsTypes.FUNDS_ALLOCATION:
      return getSubtitleForFundsAllocation(proposal);
    default:
      return null;
  }
};
