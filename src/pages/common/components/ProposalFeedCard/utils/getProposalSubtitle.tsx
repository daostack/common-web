import React, { ReactNode } from "react";
import { ProposalsTypes } from "@/shared/constants";
import { Proposal } from "@/shared/models";
import { FundsAllocation } from "@/shared/models/governance/proposals";
import { formatPriceEntrance, getUserName } from "@/shared/utils";
import { ProposalSpecificData } from "../types";

const getSubtitleForFundsAllocation = (
  fundsAllocation: FundsAllocation,
  proposalSpecificData: ProposalSpecificData,
  commonPagePath: string,
): ReactNode => {
  const { targetUser, targetCommon } = proposalSpecificData;
  const formattedPrice = formatPriceEntrance(fundsAllocation.data.args.amount);

  if (targetCommon) {
    return (
      <>
        {formattedPrice} to project{" "}
        <a href={commonPagePath} target="_blank" rel="noopener noreferrer">
          {targetCommon.name}
        </a>
      </>
    );
  }
  if (targetUser) {
    return `${formattedPrice} for ${getUserName(targetUser)}`;
  }

  return formattedPrice;
};

export const getProposalSubtitle = (
  proposal: Proposal,
  proposalSpecificData: ProposalSpecificData,
  commonPagePath: string,
): ReactNode => {
  switch (proposal.type) {
    case ProposalsTypes.FUNDS_ALLOCATION:
      return getSubtitleForFundsAllocation(
        proposal,
        proposalSpecificData,
        commonPagePath,
      );
    default:
      return null;
  }
};
