import React, { useCallback, useState } from "react";

import { Loader } from "../../../../../shared/components";
import { Proposal, ProposalState } from "../../../../../shared/models";
import {
  formatPrice,
  getDaysAgo,
  getUserName,
  getProposalExpirationDate,
} from "../../../../../shared/utils";
import { ChatComponent } from "../ChatComponent";
import { ProposalCountDown } from "../ProposalCountDown";
import { VotesComponent } from "../VotesComponent";
import "./index.scss";
import { addMessageToProposal } from "@/containers/Common/store/actions";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";

interface DiscussionDetailModalProps {
  proposal: Proposal | null;
  commonId: string;
  onOpenJoinModal: () => void;
  isCommonMember: boolean;
  isJoiningPending: boolean;
}

export default function ProposalDetailModal({
  proposal,
  commonId,
  onOpenJoinModal,
  isCommonMember,
  isJoiningPending,
}: DiscussionDetailModalProps) {
  const date = new Date();
  const dispatch = useDispatch();
  const user = useSelector(selectUser());
  const [imageError, setImageError] = useState(false);
  const rawRequestedAmount =
    proposal?.fundingRequest?.amount || proposal?.join?.funding;

  const sendMessage = useCallback(
    (message: string) => {
      if (proposal && user && user.uid) {
        const d = new Date();
        const payload = {
          text: message,
          createTime: d,
          ownerId: user.uid,
          commonId: proposal.commonId,
          discussionId: proposal.id,
        };

        dispatch(addMessageToProposal.request({ payload, proposal }));
      }
    },
    [dispatch, user, proposal]
  );

  return !proposal ? (
    <Loader />
  ) : (
    <div className="discussion-detail-modal-wrapper">
      <div className="left-side">
        <div className="top-side">
          {proposal.state === ProposalState.COUNTDOWN ? (
            <ProposalCountDown date={getProposalExpirationDate(proposal)} />
          ) : (
            <div
              className={`state-wrapper ${proposal.state.toLocaleLowerCase()}`}
            >
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
                  {proposal.state === ProposalState.REJECTED
                    ? "Rejected"
                    : "Approved"}
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
              {!rawRequestedAmount ? (
                "No funding requested"
              ) : (
                <>
                  Requested amount
                  <span className="amount">
                    {formatPrice(rawRequestedAmount)}
                  </span>
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
          commonId={commonId}
          discussionMessage={proposal.discussionMessage || []}
          onOpenJoinModal={onOpenJoinModal}
          isCommonMember={isCommonMember}
          isJoiningPending={isJoiningPending}
          isAuthorized={Boolean(user)}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}
