import React, { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Proposal,
  Common,
  Governance,
  VotingCardType,
  User,
  CommonMemberWithUserInfo,
} from "@/shared/models";
import {
  AssignCircle,
  FundsAllocation,
  FundsRequest,
  RemoveCircle,
  MemberAdmittance,
  DeleteCommon,
} from "@/shared/models/governance/proposals";
import { ProposalsTypes, ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import { formatPrice } from "@/shared/utils";
import { CountDownCard } from "../../components/ProposalContainer";
import { VotingCard } from "./VotingCard";
import {
  getAssignCircleDetails,
  getDeleteCommonDetails,
  getFundsAllocationDetails,
  getMemberAdmittanceDetails,
  getRemoveCircleDetails,
} from "./helpers";
import { useCommonMembers } from "@/containers/Common/hooks";
import { ProposalDetailsItem } from "./types";
import { ProposalSpecificData } from "./useProposalSpecificData";
import "./index.scss";

interface VotingContentContainerProps {
  proposal: Proposal;
  common: Common;
  governance: Governance;
  proposer: User;
  proposalSpecificData: ProposalSpecificData;
  onVotesOpen: () => void;
  commonMembers: CommonMemberWithUserInfo[];
  subCommons: Common[];
}

export const VotingContentContainer: FC<VotingContentContainerProps> = (props) => {
  const { proposal, governance, proposer, proposalSpecificData, onVotesOpen, common, commonMembers, subCommons } =
    props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const proposalDetailsByType = useMemo((): ProposalDetailsItem[] => {
    let typedProposal;

    switch (proposal.type) {
      case ProposalsTypes.FUNDS_ALLOCATION:
        return getFundsAllocationDetails(
          proposal as FundsAllocation,
          governance,
          commonMembers,
          subCommons,
        );
      case ProposalsTypes.FUNDS_REQUEST:
        typedProposal = proposal as FundsRequest;

        return [
          {
            title: "Recurring indication",
            value: proposal.local.allowedPaymentTypes.SINGLE ? "Single" : "Monthly"
          },
          {
            title: "Sum of money",
            value: formatPrice(typedProposal.data.legal.totalInvoicesAmount || 0, { shouldRemovePrefixFromZero: false }),
          },
          {
            title: "Recipients circles",
            value: "",
          }
        ];
      case ProposalsTypes.ASSIGN_CIRCLE:
        return getAssignCircleDetails(
          proposal as AssignCircle,
          proposalSpecificData.user,
          governance
        );
      case ProposalsTypes.REMOVE_CIRCLE:
        return getRemoveCircleDetails(
          proposal as RemoveCircle,
          proposalSpecificData.user,
          governance
        );
      case ProposalsTypes.MEMBER_ADMITTANCE:
        return getMemberAdmittanceDetails(
          proposal as MemberAdmittance,
          proposer,
          governance
        );
      case ProposalsTypes.DELETE_COMMON:
        return getDeleteCommonDetails(
          proposal as DeleteCommon,
          proposer,
          governance
        );
      default:
        return [];
    }
  }, [proposal, proposal.type, proposalSpecificData]);

  return (
    <div className="voting-content__wrapper">
      <div
        className="voting-content__proposal-details"
        style={
          !isMobileView
            ? {
              gridTemplateColumns: `repeat(${proposalDetailsByType.length}, minmax(0, 17.625rem))`,
            }
            : {}
        }
      >
        {proposalDetailsByType.map(({ title, value }) => (
          <div
            key={title}
            className="voting-content__proposal-details-item voting-content__info-block"
          >
            <div className="title">{title}</div>
            <div className="value">{value}</div>
          </div>
        ))}
      </div>
      <div className="voting-content__voting-chart">
        <div className="voting-content__countdown-card-wrapper">
          <CountDownCard
            className="voting-content__countdown-card"
            proposal={proposal}
          />
        </div>
        <VotingCard
          className="voting-content__voting-card"
          type={VotingCardType.AllVotes}
          votedMembersAmount={proposal.votes.total}
          membersAmount={proposal.votes.totalMembersWithVotingRight}
          percentageCondition={proposal.global.quorum}
          onClick={onVotesOpen}
        />
        <VotingCard
          className="voting-content__voting-card"
          type={VotingCardType.Object}
          percentageCondition={proposal.global.maxReject}
          targetVotersAmount={proposal.votes.rejected}
          votedMembersAmount={proposal.votes.total}
        />
        <VotingCard
          className="voting-content__voting-card"
          type={VotingCardType.Support}
          percentageCondition={proposal.global.minApprove}
          targetVotersAmount={proposal.votes.approved}
          votedMembersAmount={proposal.votes.total}
        />
        <VotingCard
          className="voting-content__voting-card"
          type={VotingCardType.Abstain}
          targetVotersAmount={proposal.votes.abstained}
          votedMembersAmount={proposal.votes.total}
        />
      </div>
    </div>
  );
};
