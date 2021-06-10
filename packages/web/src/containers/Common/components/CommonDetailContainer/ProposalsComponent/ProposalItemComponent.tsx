import React, { useState } from "react";
import { ProposalCountDown } from "..";
import { Proposal } from "../../../../../shared/models";
import { formatPrice, getUserName, getDaysAgo } from "../../../../../shared/utils";
import { VotesComponent } from "../VotesComponent";

interface ProposalItemComponentProps {
  loadProposalDetail: Function;
  proposal: Proposal;
}

export default function ProposalItemComponent({ proposal, loadProposalDetail }: ProposalItemComponentProps) {
  const [imageError, setImageError] = useState(false);
  const date = new Date();
  const requestedAmount = formatPrice(proposal.fundingRequest?.amount || proposal.join?.funding);
  return (
    <div className="discussion-item-wrapper">
      {proposal.state === "countdown" ? (
        <ProposalCountDown date={new Date((proposal?.createdAt.seconds + proposal.countdownPeriod) * 1000)} />
      ) : (
        <div className={`state-wrapper ${proposal.state}`}>
          <div className="state-inner-wrapper">
            <img
              src={proposal.state === "failed" ? "/icons/declined.svg" : "/icons/approved.svg"}
              alt="state-wrapper"
            />
            <span className="state-name">{proposal.state === "failed" ? "Rejected" : "Approved"}</span>
          </div>
        </div>
      )}
      <div className="proposal-charts-wrapper">
        <div className="proposal-title" onClick={() => loadProposalDetail(proposal)}>
          {proposal.description.title}
        </div>
        <div className="requested-amount">
          {requestedAmount === "$0" ? (
            "No funding requested"
          ) : (
            <>
              Requested amount <span className="amount">{requestedAmount}</span>
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
          {!imageError ? (
            <img
              src={proposal.proposer?.photoURL}
              alt={getUserName(proposal.proposer)}
              onError={() => setImageError(true)}
            />
          ) : (
            <img src="/icons/default_user.svg" alt={getUserName(proposal.proposer)} />
          )}
        </div>
        <div className="creator-information">
          <div className="name">{getUserName(proposal.proposer)}</div>
          <div className="days-ago">{getDaysAgo(date, proposal.createdAt)} </div>
        </div>
      </div>
      <div className="discussion-content">
        <div className="description">{proposal.description.description}</div>
        <div className="read-more" onClick={() => loadProposalDetail(proposal)}>
          Read More
        </div>
        <div className="line"></div>
      </div>
      <div className="bottom-content">
        <div className="discussion-count">
          <img src="/icons/discussions.svg" alt="discussions" />
          <div className="count">{proposal.discussionMessage?.length || 0}</div>
        </div>
        {proposal && (
          <div className="view-all-discussions" onClick={() => loadProposalDetail(proposal)}>
            View proposal
          </div>
        )}
      </div>
    </div>
  );
}
