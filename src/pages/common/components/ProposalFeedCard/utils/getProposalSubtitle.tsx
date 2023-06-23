import React, { ReactNode } from "react";
import { ProposalsTypes } from "@/shared/constants";
import { Proposal } from "@/shared/models";
import { FundsAllocation } from "@/shared/models/governance/proposals";
import {
  formatPriceEntrance,
  getCommonPagePath,
  getUserName,
} from "@/shared/utils";
import { ProposalSpecificData } from "../types";

const getSubtitleForFundsAllocation = (
  fundsAllocation: FundsAllocation,
  proposalSpecificData: ProposalSpecificData,
): ReactNode => {
  const { targetUser, targetCommon } = proposalSpecificData;
  const formattedPrice = formatPriceEntrance(fundsAllocation.data.args.amount);

  if (targetCommon) {
    return (
      <>
        {formattedPrice} to project{" "}
        <a
          href={getCommonPagePath(targetCommon.id)}
          target="_blank"
          rel="noopener noreferrer"
        >
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
): ReactNode => {
  switch (proposal.type) {
    case ProposalsTypes.FUNDS_ALLOCATION:
      return getSubtitleForFundsAllocation(proposal, proposalSpecificData);
    default:
      return null;
  }
};
