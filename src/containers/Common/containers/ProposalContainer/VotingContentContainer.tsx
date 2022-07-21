import React, { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import {
  Proposal,
  Common,
  Governance,
  VotingCardType,
  User,
} from "@/shared/models";
import {
  AssignCircle,
  FundsAllocation,
  FundsRequest,
  RemoveCircle,
  FundingAllocationStatus,
  MemberAdmittance,
} from "@/shared/models/governance/proposals";
import { ProposalsTypes, ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import { formatPrice } from "@/shared/utils";
import { VotingCard } from "./VotingCard";
import {
  getAssignCircleDetails,
  getFundsAllocationDetails,
  getMemberAdmittanceDetails,
} from "./helpers";
import { ProposalDetailsItem } from "./types";
import "./index.scss";

interface VotingContentContainerProps {
  proposal: Proposal;
  common: Common;
  governance: Governance;
  proposer: User;
}

export const VotingContentContainer: FC<VotingContentContainerProps> = ({ proposal, common, governance, proposer }) => {
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const proposalDetailsByType = useMemo((): ProposalDetailsItem[] => {
    let typedProposal;

    switch (proposal.type) { //TODO: fill up with a real proposal's data
      case ProposalsTypes.FUNDS_ALLOCATION:
        return getFundsAllocationDetails(
          proposal as FundsAllocation,
          proposer,
          governance
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
          proposer,
          governance
        );
      case ProposalsTypes.REMOVE_CIRCLE:
        typedProposal = proposal as RemoveCircle;

        return [
          {
            title: "Name of member",
            value: "",
          },
          {
            title: "Circle to be de-assigned from",
            value: "",
          }
        ];
      case ProposalsTypes.MEMBER_ADMITTANCE:
        return getMemberAdmittanceDetails(
          proposal as MemberAdmittance,
          proposer,
          governance
        );
      default:
        return [];
    }
  }, [proposal, proposal.type]);

  const votingStatusElem = useMemo(//TODO: expand this with more options
    () => {
      switch (proposal.type) {
        case ProposalsTypes.FUNDS_ALLOCATION:
          switch (proposal.data.tracker.status) {
            case FundingAllocationStatus.PENDING_PROPOSAL_APPROVAL:
              return (
                <div
                  className={
                    classNames(
                      "voting-status",
                      { passing: true }
                    )
                  }
                >
                  Passing
                </div>
              );
          }
      }
    },
    [proposal, proposal.type]
  );

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
        {/* <div className="voting-content__voting-chart-main-info voting-content__info-block">
          <div className="voting-content__voting-time">
            <span>Time to Vote</span>
            <div className="expire-time">{proposal.global.votingDuration}</div>
          </div>
          <div className="voting-content__voting-status">
            <span>Voting Status</span>
            {votingStatusElem}
          </div>
        </div> */}
        <div className="voting-content__voting-stats-container">
          <VotingCard
            type={VotingCardType.AllVotes}
            votedMembersAmount={proposal.votes.total}
            membersAmount={common.memberCount}
            percentageCondition={proposal.global.quorum}
          />
          <VotingCard
            type={VotingCardType.Object}
            percentageCondition={proposal.global.maxReject}
            targetVotersAmount={proposal.votes.rejected}
            votedMembersAmount={proposal.votes.total}
          />
          <VotingCard
            type={VotingCardType.Support}
            percentageCondition={proposal.global.minApprove}
            targetVotersAmount={proposal.votes.approved}
            votedMembersAmount={proposal.votes.total}
          />
          <VotingCard
            type={VotingCardType.Abstain}
            targetVotersAmount={proposal.votes.abstained}
            votedMembersAmount={proposal.votes.total}
          />
        </div>
      </div>
    </div>
  );
};
