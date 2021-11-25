import React, { useState } from "react";

import { Loader } from "../../../../../shared/components";
import { Proposal } from "../../../../../shared/models";
import {
  formatPrice,
  getDaysAgo,
  getUserName,
} from "../../../../../shared/utils";
import { ChatComponent } from "../ChatComponent";
import { ProposalCountDown } from "../ProposalCountDown";
import { VotesComponent } from "../VotesComponent";
import "./index.scss";

interface DiscussionDetailModalProps {
  proposal: Proposal | null;
  onOpenJoinModal: () => void;
  isCommonMember: boolean;
}

export default function ProposalDetailModal({
  proposal,
  onOpenJoinModal,
  isCommonMember,
}: DiscussionDetailModalProps) {
  const date = new Date();
  const [imageError, setImageError] = useState(false);
  const requestedAmount = formatPrice(
    proposal?.fundingRequest?.amount || proposal?.join?.funding
  );
  return !proposal ? (
    <Loader />
  ) : (
    <div className="discussion-detail-modal-wrapper">
      <div className="left-side">
        <div className="top-side">
          {proposal.state === "countdown" ? (
            <ProposalCountDown
              date={
                new Date(
                  (proposal?.createdAt.seconds + proposal.countdownPeriod) *
                    1000
                )
              }
            />
          ) : (
            <div
              className={`state-wrapper ${proposal.state.toLocaleLowerCase()}`}
            >
              <div className="state-inner-wrapper">
                <img
                  src={
                    proposal.state === "failed"
                      ? "/icons/declined.svg"
                      : "/icons/approved.svg"
                  }
                  alt="state-wrapper"
                />
                <span className="state-name">
                  {proposal.state === "failed" ? "Rejected" : "Approved"}
                </span>
              </div>
            </div>
          )}
          <div className="owner-wrapper">
            <div className="owner-icon-wrapper">
              {!imageError ? (
                <img
                  src={proposal.proposer?.photoURL}
                  alt={getUserName(proposal.proposer)}
                  onError={() => setImageError(true)}
                />
              ) : (
                <img
                  src="/icons/default_user.svg"
                  alt={getUserName(proposal.proposer)}
                />
              )}
            </div>
            <div className="owner-name">{getUserName(proposal.proposer)}</div>
            <div className="days-ago">
              {getDaysAgo(date, proposal.createdAt)}
            </div>
          </div>
          <div className="discussion-information-wrapper">
            <div className="discussion-name" title={proposal.description.title}>
              {proposal.description.title}
            </div>
            <div className="requested-amount">
              {requestedAmount === "$0" ? (
                "No funding requested"
              ) : (
                <>
                  Requested amount
                  <span className="amount">{requestedAmount}</span>
                </>
              )}
            </div>
            <VotesComponent proposal={proposal} />
          </div>
          <div className="line"></div>
        </div>
        <div className="down-side">
          <p className="description">{proposal.description.description}</p>
        </div>
      </div>
      <div className="right-side">
        <ChatComponent
          discussionMessage={proposal.discussionMessage || []}
          onOpenJoinModal={onOpenJoinModal}
          isCommonMember={isCommonMember}
        />
      </div>
    </div>
  );
}
