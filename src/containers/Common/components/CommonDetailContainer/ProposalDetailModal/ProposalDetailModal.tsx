import React, { useCallback, useState, useMemo } from "react";
import classNames from "classnames";

import { Loader, UserAvatar } from "@/shared/components";
import {
  Common,
  Proposal,
  ProposalWithHighlightedComment,
  isProposalWithHighlightedComment,
  CommonMember,
} from "@/shared/models";
import { isFundsAllocationProposal } from "@/shared/models/governance/proposals";
import { formatPrice, getDaysAgo, getUserName } from "@/shared/utils";
import { ChatComponent } from "../ChatComponent";
import { VotesComponent } from "../VotesComponent";
import { ProposalState } from "../ProposalState";
import { addMessageToProposal } from "@/containers/Common/store/actions";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import { getScreenSize } from "@/shared/store/selectors";
import { ScreenSize, ChatType } from "@/shared/constants";
import "./index.scss";

interface ProposalDetailModalProps {
  proposal: Proposal | ProposalWithHighlightedComment | null;
  common: Common | null;
  onOpenJoinModal?: () => void;
  isJoiningPending?: boolean;
  isCommonMemberFetched: boolean;
  commonMember: CommonMember | null;
}

export default function ProposalDetailModal({
  proposal,
  common,
  onOpenJoinModal,
  isCommonMemberFetched,
  isJoiningPending,
  commonMember,
}: ProposalDetailModalProps) {
  const date = new Date();
  const dispatch = useDispatch();
  const user = useSelector(selectUser());
  const rawRequestedAmount = isFundsAllocationProposal(proposal)
    ? proposal.data.args.amount
    : 0;
  const screenSize = useSelector(getScreenSize());
  const [expanded, setExpanded] = useState(true);
  const highlightedCommentId = useMemo(
    () =>
      isProposalWithHighlightedComment(proposal)
        ? proposal.highlightedCommentId
        : null,
    [proposal]
  );

  const sendMessage = useCallback(
    (message: string) => {
      if (proposal && user && user.uid) {
        const d = new Date();
        const payload = {
          text: message,
          createTime: d,
          ownerId: user.uid,
          commonId: proposal.data.args.commonId,
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
                  <UserAvatar
                    photoURL={proposal.proposer?.photoURL}
                    nameForRandomAvatar={proposal.proposer?.email}
                    userName={getUserName(proposal.proposer)}
                  />
                </div>

                <div className="owner-name-and-days-container">
                  <div className="owner-name">
                    {getUserName(proposal.proposer)}
                  </div>
                  <div className="days-ago">
                    {getDaysAgo(date, proposal.createdAt)}
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="proposal-information-wrapper">
            <div
              className="proposal-name"
              title={proposal.data.args.title || "Membership request"}
            >
              {proposal.data.args.title || "Membership request"}
            </div>
            {rawRequestedAmount && expanded && (
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
                <VotesComponent
                  proposal={proposal}
                  commonMember={commonMember}
                />
              </>
            )}
          </div>
        </div>

        {expanded && (
          <div className="description-container">
            <p className="description">{proposal.data.args.description}</p>
          </div>
        )}

        {screenSize === ScreenSize.Mobile && (
          <div className="expand-btn-container">
            <img
              className={classNames({
                expanded: expanded,
                collapsed: !expanded,
              })}
              onClick={() => setExpanded(!expanded)}
              src="/icons/expand-arrow.svg"
              alt="expand icon"
            />
          </div>
        )}
      </div>
      <div className="chat-container">
        <ChatComponent
          common={common}
          discussionMessage={proposal.discussionMessage || []}
          type={ChatType.ProposalComments}
          highlightedMessageId={highlightedCommentId}
          onOpenJoinModal={onOpenJoinModal}
          commonMember={commonMember}
          isCommonMemberFetched={isCommonMemberFetched}
          isJoiningPending={isJoiningPending}
          isAuthorized={Boolean(user)}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}
