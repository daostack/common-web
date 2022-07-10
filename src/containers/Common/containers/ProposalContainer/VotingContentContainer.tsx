import React, { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { Proposal, VotingCardType } from "@/shared/models";
import {
  AssignCircle,
  FundsAllocation,
  FundsRequest,
  MemberAdmittance,
  RemoveCircle,
  FUNDING_TYPES,
  FundingAllocationStatus,
} from "@/shared/models/governance/proposals";
import { getScreenSize } from "@/shared/store/selectors";
import { ProposalsTypes, ScreenSize } from "@/shared/constants";
import { formatPrice, formatDate } from "@/shared/utils";
import { VotingCard } from "./VotingCard";
import "./index.scss";

interface VotingContentContainerProps {
  proposal: Proposal;
}

interface ProposalDetailsItem {
  title: string;
  value: string;
}

export const VotingContentContainer: FC<VotingContentContainerProps> = ({ proposal }) => {
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const proposalDetailsByType = useMemo((): ProposalDetailsItem[] => {
    let typedProposal;

    switch (proposal.type) { //TODO: fill up with a real proposal's data
      case ProposalsTypes.FUNDS_ALLOCATION:
        typedProposal = proposal as FundsAllocation;

        return [
          {
            title: "Type of funds",
            value: "ToDo",
          },
          {
            title: "Sum of money",
            value: formatPrice(typedProposal.data.legal.totalInvoicesAmount || 0, { shouldRemovePrefixFromZero: false }),
          },
          {
            title: "Recurring",
            value: (Math.random()%2 === 0)
                    ? "Monthly"
                    : "Single",
          },
          {
            title: "Recipients",
            value: String(typedProposal.global.weights.length),
          },
          {
            title: "Net+",
            value: "Immediately",
          },
        ];
      case ProposalsTypes.FUNDS_REQUEST:
        typedProposal = proposal as FundsRequest;

        return [
          {
            title: "Recurring indication",
            value: (Math.random()%2 === 0)
                    ? "Monthly"
                    : "Single",
          },
          {
            title: "Sum of money",
            value: "",
          },
          {
            title: "Recipients circles",
            value: "",
          }
        ];
      case ProposalsTypes.ASSIGN_CIRCLE:
        typedProposal = proposal as AssignCircle;
        
        return [
          {
            title: "Name of member",
            value: ""
          },
          {
            title: "Circle to be assigned to",
            value: "",
          }
        ];
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

  const votingContentAdditionalInfoElem = (
    <div className="voting-content__additional-info">
      At least 3 more support and 4 more <br /> abstain\support are required to pass
    </div>
  );

  return (
    <div className="voting-content__wrapper">
      <div className="voting-content__proposal-details">
        {
          proposalDetailsByType.map(
            ({ title, value }) =>
              <div
                key={title}
                className="voting-content__proposal-details-item voting-content__info-block"
              >
                <div className="title">
                  {title}
                </div>
                <div className="value">
                  {value}
                </div>
              </div>
          )
        }
      </div>
      <div className="voting-content__voting-chart">
        <div className="voting-content__voting-chart-main-info voting-content__info-block">
          <div className="voting-content__voting-time">
            <span>Time to Vote</span>
            <div className="expire-time">{proposal.global.votingDuration}</div>
          </div>
          <div className="voting-content__voting-status">
            <span>Voting Status</span>
            {votingStatusElem}
          </div>
          {
            !isMobileView && votingContentAdditionalInfoElem
          }
        </div>
        {/* TODO: fill up with a real proposal's datasets */}
        <div className="voting-content__voting-stats-container">
          <VotingCard
            type={VotingCardType.AllVotes}
            votedMembersAmount={20}
            membersAmount={30}
            percentageCondition={50}
          />
          <VotingCard
            type={VotingCardType.Object}
            percentageCondition={20}
            targetVotersAmount={15}
            votedMembersAmount={20}
          />
          <VotingCard
            type={VotingCardType.Support}
            percentageCondition={20}
            targetVotersAmount={15}
            votedMembersAmount={20}
          />
          <VotingCard
            type={VotingCardType.Abstain}
            targetVotersAmount={9}
            votedMembersAmount={20}
          />
        </div>
      </div>
      {
        isMobileView && votingContentAdditionalInfoElem
      }
    </div>
  );
};
