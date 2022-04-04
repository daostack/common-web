import React, { useCallback, useState } from "react";

import { Loader } from "../../../../../shared/components";
import { Common, Proposal } from "../../../../../shared/models";
import {
  formatPrice,
  getDaysAgo,
  getUserName,
} from "../../../../../shared/utils";
import { ChatComponent } from "../ChatComponent";
import { VotesComponent } from "../VotesComponent";
import { ProposalState } from "../ProposalState";
import { addMessageToProposal } from "@/containers/Common/store/actions";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import "./index.scss";
import { getScreenSize } from "@/shared/store/selectors";
import { ScreenSize } from "@/shared/constants";
import classNames from "classnames";

interface DiscussionDetailModalProps {
  proposal: Proposal | null;
  common: Common;
  onOpenJoinModal: () => void;
  isCommonMember: boolean;
  isJoiningPending: boolean;
}

export default function ProposalDetailModal({
  proposal,
  common,
  onOpenJoinModal,
  isCommonMember,
  isJoiningPending,
}: DiscussionDetailModalProps) {
  const date = new Date();
  const dispatch = useDispatch();
  const user = useSelector(selectUser());
  const rawRequestedAmount =
    proposal?.fundingRequest?.amount || proposal?.join?.funding;
  const screenSize = useSelector(getScreenSize());
  const [expanded, setExpanded] = useState(true);

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
    <div className="proposal-detail-modal-wrapper">
      <div className="proposal-details-container">
        <div className="user-and-title-container">
          {expanded && (
            <>
              <ProposalState proposal={proposal} />
              <div className="owner-wrapper">
                <div className="owner-icon-wrapper">
                  <img
                    src={proposal.proposer?.photoURL}
                    alt={getUserName(proposal.proposer)}
                    onError={(event: any) => event.target.src = "/icons/default_user.svg"}
                  />
                </div>
                <div className="owner-name-and-days-container">
                  <div className="owner-name">{getUserName(proposal.proposer)}</div>
                  <div className="days-ago">
                    {getDaysAgo(date, proposal.createdAt)}
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="proposal-information-wrapper">
            <div className="proposal-name" title={proposal.description.title}>
              {proposal.description.title}
            </div>
            {expanded && (
              <>
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
                <VotesComponent proposal={proposal} isCommonMember={isCommonMember} />
              </>)}
          </div>
        </div>

        {expanded && (
          <div className="description-container">
            <p className="description">{proposal.description.description}</p>
          </div>
        )}

        {screenSize === ScreenSize.Mobile && (
          <div className="expand-btn-container">
            <img className={classNames({ "expanded": expanded, "collapsed": !expanded })} onClick={() => setExpanded(!expanded)} src="/icons/expand-arrow.svg" alt="expand icon" />
          </div>
        )}

      </div>
      <div className="chat-container">
        <ChatComponent
          common={common}
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
