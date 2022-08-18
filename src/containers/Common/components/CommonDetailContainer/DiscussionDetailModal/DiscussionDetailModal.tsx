import React, { useCallback, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";

import { Loader } from "@/shared/components";
import {
  Common,
  CommonMember,
  Discussion,
  DiscussionWithHighlightedMessage,
  isDiscussionWithHighlightedMessage,
} from "@/shared/models";
import { getDaysAgo, getUserName } from "@/shared/utils";
import { ChatComponent } from "../ChatComponent";
import { selectUser } from "@/containers/Auth/store/selectors";
import { addMessageToDiscussion } from "@/containers/Common/store/actions";
import { getScreenSize } from "@/shared/store/selectors";
import { ScreenSize, ChatType } from "@/shared/constants";
import "./index.scss";

interface DiscussionDetailModalProps {
  discussion: Discussion | DiscussionWithHighlightedMessage | null;
  common: Common;
  onOpenJoinModal: () => void;
  commonMember: CommonMember | null;
  isCommonMemberFetched: boolean;
  isJoiningPending: boolean;
}

export default function DiscussionDetailModal({
  discussion,
  common,
  onOpenJoinModal,
  commonMember,
  isCommonMemberFetched,
  isJoiningPending,
}: DiscussionDetailModalProps) {
  const dispatch = useDispatch();
  const date = new Date();
  const user = useSelector(selectUser());
  const screenSize = useSelector(getScreenSize());
  const [expanded, setExpanded] = useState(true);
  const highlightedMessageId = useMemo(
    () =>
      isDiscussionWithHighlightedMessage(discussion)
        ? discussion.highlightedMessageId
        : null,
    [discussion]
  );

  const sendMessage = useCallback(
    (message: string) => {
      if (discussion && user && user.uid) {
        const d = new Date();
        const payload = {
          text: message,
          createTime: d,
          ownerId: user.uid,
          commonId: discussion.commonId,
          discussionId: discussion.id,
        };

        dispatch(
          addMessageToDiscussion.request({ payload, discussion: discussion })
        );
      }
    },
    [dispatch, user, discussion]
  );

  return !discussion ? (
    <Loader />
  ) : (
    <div className="discussion-detail-modal-wrapper">
      <div className="discussion-details-container">
        <div className="user-and-title-container">
          {expanded && (
            <div className="owner-wrapper">
              <div className="owner-icon-wrapper">
                <img
                  src={discussion.owner?.photoURL}
                  alt={getUserName(discussion.owner)}
                  onError={(event: any) =>
                    (event.target.src = "/icons/default_user.svg")
                  }
                />
              </div>
              <div className="owner-name-and-days-container">
                <div className="owner-name">
                  {getUserName(discussion.owner)}
                </div>
                <div className="days-ago">
                  {getDaysAgo(date, discussion.createdAt)}
                </div>
              </div>
            </div>
          )}
          <div className="discussion-information-wrapper">
            <div className="discussion-name" title={discussion.title}>
              {discussion.title}
            </div>
          </div>
        </div>

        {expanded && (
          <div className="description-container">
            <p className="description">{discussion.message}</p>
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
          discussionMessages={discussion.discussionMessages || []}
          type={ChatType.DiscussionMessages}
          highlightedMessageId={highlightedMessageId}
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
