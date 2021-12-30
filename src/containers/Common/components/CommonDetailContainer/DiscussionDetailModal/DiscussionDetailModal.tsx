import React, { useCallback, useState } from "react";

import { Loader } from "../../../../../shared/components";
import { Discussion } from "../../../../../shared/models";
import { getDaysAgo, getUserName } from "../../../../../shared/utils";
import { ChatComponent } from "../ChatComponent";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import { addMessageToDiscussion } from "@/containers/Common/store/actions";

interface DiscussionDetailModalProps {
  disscussion: Discussion | null;
  onOpenJoinModal: () => void;
  isCommonMember?: boolean;
  isJoiningPending: boolean;
}

export default function DiscussionDetailModal({
  disscussion,
  onOpenJoinModal,
  isCommonMember,
  isJoiningPending,
}: DiscussionDetailModalProps) {
  const dispatch = useDispatch();
  const date = new Date();
  const user = useSelector(selectUser());
  const [imageError, setImageError] = useState(false);

  const sendMessage = useCallback(
    (message: string) => {
      if (disscussion && user) {
        const d = new Date();
        const payload = {
          text: message,
          createTime: d,
          ownerId: user.uid,
          commonId: disscussion.commonId,
          discussionId: disscussion.id,
        };

        dispatch(
          addMessageToDiscussion.request({ payload, discussion: disscussion })
        );
      }
    },
    [dispatch, user, disscussion]
  );

  return !disscussion ? (
    <Loader />
  ) : (
    <div className="discussion-detail-modal-wrapper">
      <div className="left-side">
        <div className="top-side">
          <div className="owner-wrapper">
            <div className="owner-icon-wrapper">
              {!imageError ? (
                <img
                  src={disscussion.owner?.photoURL}
                  alt={getUserName(disscussion.owner)}
                  onError={() => setImageError(true)}
                />
              ) : (
                <img
                  src="/icons/default_user.svg"
                  alt={getUserName(disscussion.owner)}
                />
              )}
            </div>
            <div className="owner-name">{getUserName(disscussion.owner)}</div>
            <div className="days-ago">
              {getDaysAgo(date, disscussion.createTime)}
            </div>
          </div>
          <div className="discussion-information-wrapper">
            <div className="discussion-name" title={disscussion.title}>
              {disscussion.title}
            </div>
          </div>
          <div className="line"></div>
        </div>
        <div className="down-side">
          <p className="description">{disscussion.message}</p>
        </div>
      </div>
      <div className="right-side">
        <ChatComponent
          discussionMessage={disscussion.discussionMessage || []}
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
