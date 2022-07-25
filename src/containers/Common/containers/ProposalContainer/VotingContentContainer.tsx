import React, { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import classNames from 'classnames';
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
  MemberAdmittance,
} from "@/shared/models/governance/proposals";
import { ProposalsTypes, ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import { checkIsCountdownState, formatPrice } from "@/shared/utils";
import { CountDownCard } from "../../components/ProposalContainer";
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
  const expirationTimestamp =
    proposal.data.votingExpiresOn || proposal.data.discussionExpiresOn;

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
      <div
        className={classNames("voting-content__voting-chart", {
          "voting-content__voting-chart--two-columns":
            !checkIsCountdownState(proposal) || !expirationTimestamp,
        })}
      >
        {checkIsCountdownState(proposal) && expirationTimestamp && (
          <div className="voting-content__countdown-card-wrapper">
            <CountDownCard
              className="voting-content__countdown-card"
              date={new Date(expirationTimestamp.seconds * 1000)}
              proposal={proposal}
              memberCount={common.memberCount}
            />
          </div>
        )}
        <VotingCard
          className="voting-content__voting-card"
          type={VotingCardType.AllVotes}
          votedMembersAmount={proposal.votes.total}
          membersAmount={common.memberCount}
          percentageCondition={proposal.global.quorum}
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
