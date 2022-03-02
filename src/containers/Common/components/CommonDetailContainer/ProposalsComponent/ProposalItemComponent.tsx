import React from "react";
import classNames from "classnames";

import { ProposalCountDown } from "..";
import { UserAvatar } from "../../../../../shared/components";
import { useFullText } from "../../../../../shared/hooks";
import { FundingProcessStage, Proposal, ProposalState } from "../../../../../shared/models";
import { formatPrice, getUserName, getDaysAgo } from "../../../../../shared/utils";
import { VotesComponent } from "../VotesComponent";

interface ProposalItemComponentProps {
  loadProposalDetail: (payload: Proposal) => void;
  proposal: Proposal;
}

export default function ProposalItemComponent({
  proposal,
  loadProposalDetail,
}: ProposalItemComponentProps) {
  const {
    ref: descriptionRef,
    isFullTextShowing,
    shouldShowFullText,
    showFullText,
  } = useFullText();
  const date = new Date();
  const rawRequestedAmount = proposal.fundingRequest?.amount || proposal.join?.funding;

  return (
    <div className="discussion-item-wrapper">
      {proposal.state === ProposalState.COUNTDOWN ? (
        <ProposalCountDown
          date={
            new Date(
              (proposal?.createdAt.seconds + proposal.countdownPeriod) * 1000
            )
          }
        />
      ) : (
        <div className={`state-wrapper ${proposal.state.toLocaleLowerCase()}`}>
          <div className="state-inner-wrapper">
            <img
              src={
                proposal.state === ProposalState.REJECTED
                  ? "/icons/declined.svg"
                  : "/icons/approved.svg"
              }
              alt="state-wrapper"
            />
            <span className="state-name">
              {proposal.state === ProposalState.REJECTED ? "Rejected" : <span>Approved {proposal?.fundingProcessStage === FundingProcessStage.ExpiredInvociesNotUploaded && <span className="unclaimed-label">unclaimed</span>}</span>}
            </span>
          </div>
        </div>
      )}
      <div className="proposal-charts-wrapper">
        <div
          className="proposal-title"
          onClick={() => loadProposalDetail(proposal)}
          title={proposal.description.title}
        >
          {proposal.description.title}
        </div>
        <div className="requested-amount">
          {!rawRequestedAmount ? (
            "No funding requested"
          ) : (
            <>
              Requested amount <span className="amount">{formatPrice(rawRequestedAmount)}</span>
            </>
          )}
        </div>
        <div className="votes">
          <VotesComponent proposal={proposal} />
        </div>
      </div>
      <div className="line" />
      <div className="discussion-top-bar">
        <div className="img-wrapper">
          <UserAvatar
            photoURL={proposal.proposer?.photoURL}
            nameForRandomAvatar={proposal.proposer?.email}
            userName={getUserName(proposal.proposer)}
          />
        </div>
        <div className="creator-information">
          <div className="name">{getUserName(proposal.proposer)}</div>
          <div className="days-ago">{getDaysAgo(date, proposal.createdAt)}</div>
        </div>
      </div>
      <div className="discussion-content">
        <div
          className={classNames("description", { full: shouldShowFullText })}
          ref={descriptionRef}
        >
          {proposal.description.description}
        </div>
        {!isFullTextShowing ? (
          <div className="read-more" onClick={showFullText}>
            Read More
          </div>
        ) : null}
        <div className="line"></div>
      </div>
      <div className="bottom-content">
        <div className="discussion-count">
          <img src="/icons/discussions.svg" alt="discussions" />
          <div className="count">{proposal.discussionMessage?.length || 0}</div>
        </div>
        {proposal && (
          <div
            className="view-all-discussions"
            onClick={() => loadProposalDetail(proposal)}
          >
            View proposal
          </div>
        )}
      </div>
    </div>
  );
}
