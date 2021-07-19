import React, { useState } from "react";

import { Loader } from "../../../../../shared/components";
import { Proposal } from "../../../../../shared/models";
import { formatPrice, getDaysAgo, getUserName } from "../../../../../shared/utils";
import { ChatComponent } from "../ChatComponent";
import { ProposalCountDown } from "../ProposalCountDown";
import { VotesComponent } from "../VotesComponent";
import "./index.scss";

interface DiscussionDetailModalProps {
  proposal: Proposal | null;
  onOpenJoinModal: () => void;
}

export default function ProposalDetailModal({ proposal, onOpenJoinModal }: DiscussionDetailModalProps) {
  const date = new Date();
  const [imageError, setImageError] = useState(false);
  const requestedAmount = formatPrice(proposal?.fundingRequest?.amount || proposal?.join?.funding);
  return !proposal ? (
    <Loader />
  ) : (
    <div className="discussion-detail-modal-wrapper">
      <div className="left-side">
        <div className="top-side">
          {proposal.state === "countdown" ? (
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
          <div className="owner-wrapper">
            <div className="owner-icon-wrapper">
              {!imageError ? (
                <img src={proposal.user?.photo} alt={getUserName(proposal.user)} onError={() => setImageError(true)} />
              ) : (
                <img src="/icons/default_user.svg" alt={getUserName(proposal.user)} />
              )}
            </div>
            <div className="owner-name">{getUserName(proposal.user)}</div>
            <div className="days-ago">{getDaysAgo(date, proposal.createdAt)} </div>
          </div>
          <div className="discussion-information-wrapper">
            <div className="discussion-name" title={proposal.title}>
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
            <VotesComponent proposal={proposal} />
          </div>
          <div className="line"></div>
        </div>
        <div className="down-side">
          <p className="description">{proposal.description}</p>
        </div>
      </div>
      <div className="right-side">
        <ChatComponent discussionMessage={proposal.discussionMessage || []} onOpenJoinModal={onOpenJoinModal} />
      </div>
    </div>
  );
}
