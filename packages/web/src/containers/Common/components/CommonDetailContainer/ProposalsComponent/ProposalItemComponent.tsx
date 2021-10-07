import React, { useState } from "react";

import { ProposalCountDown } from "..";
import { useCalculateReadMoreLength } from "../../../../../shared/hooks";
import { Proposal } from "../../../../../shared/models";
import { formatPrice, getUserName, getDaysAgo } from "../../../../../shared/utils";
import { VotesComponent } from "../VotesComponent";

interface ProposalItemComponentProps {
  loadProposalDetail: (payload: Proposal) => void;
  proposal: Proposal;
}

export default function ProposalItemComponent({ proposal, loadProposalDetail }: ProposalItemComponentProps) {
  const [imageError, setImageError] = useState(false);
  //  const [readMore, setReadMore] = useState("");
  const date = new Date();
  const requestedAmount = formatPrice(proposal.fundingRequest?.amount || proposal.join?.funding);
  const textLength = useCalculateReadMoreLength();

  return (
    <div className="discussion-item-wrapper">
      {proposal.state === "Countdown" ? (
        <ProposalCountDown date={new Date(proposal?.expiresAt)} />
      ) : (
        <div className={`state-wrapper ${proposal.state.toLocaleLowerCase()}`}>
          <div className="state-inner-wrapper">
            <img
              src={proposal.state === "Rejected" ? "/icons/declined.svg" : "/icons/approved.svg"}
              alt="state-wrapper"
            />
            <span className="state-name">{proposal.state === "Rejected" ? "Rejected" : "Approved"}</span>
          </div>
        </div>
      )}
      <div className="proposal-charts-wrapper">
        <div className="proposal-title" onClick={() => loadProposalDetail(proposal)} title={proposal.title}>
          {proposal.title}
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
            <img src={proposal.user?.photo} alt={getUserName(proposal.user)} onError={() => setImageError(true)} />
          ) : (
            <img src="/icons/default_user.svg" alt={getUserName(proposal.user)} />
          )}
        </div>
        <div className="creator-information">
          <div className="name">{getUserName(proposal.user)}</div>
          <div className="days-ago">{getDaysAgo(date, proposal.createdAt)} </div>
        </div>
      </div>
      <div className="discussion-content">
        <div className={`description `}>{proposal.description}</div>
        {proposal.description.length > textLength ? (
          <div className="read-more" onClick={() => loadProposalDetail(proposal)}>
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
          <div className="view-all-discussions" onClick={() => loadProposalDetail(proposal)}>
            View proposal
          </div>
        )}
      </div>
    </div>
  );
}
