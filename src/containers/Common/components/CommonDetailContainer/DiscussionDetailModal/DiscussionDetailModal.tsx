import React, { useCallback, useState } from "react";

import { Loader } from "../../../../../shared/components";
import { Discussion } from "../../../../../shared/models";
import { getDaysAgo, getUserName } from "../../../../../shared/utils";
import { ChatComponent } from "../ChatComponent";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import { addMessageToDiscussion } from "@/containers/Common/store/actions";
import { getScreenSize } from "@/shared/store/selectors";
import { ScreenSize } from "@/shared/constants";
import classNames from "classnames";

interface DiscussionDetailModalProps {
  disscussion: Discussion | null;
  commonId: string;
  onOpenJoinModal: () => void;
  isCommonMember?: boolean;
  isJoiningPending: boolean;
}

export default function DiscussionDetailModal({
  disscussion,
  commonId,
  onOpenJoinModal,
  isCommonMember,
  isJoiningPending,
}: DiscussionDetailModalProps) {
  const dispatch = useDispatch();
  const date = new Date();
  const user = useSelector(selectUser());
  const screenSize = useSelector(getScreenSize());
  const [expanded, setExpanded] = useState(true);

  const sendMessage = useCallback(
    (message: string) => {
      if (disscussion && user && user.uid) {
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
      <div className="discussion-details-container">
        <div className="user-and-title-container">
          {expanded && (
            <div className="owner-wrapper">
              <div className="owner-icon-wrapper">
                <img
                  src={disscussion.owner?.photoURL}
                  alt={getUserName(disscussion.owner)}
                  onError={(event: any) => event.target.src = "/icons/default_user.svg"}
                />
              </div>
              <div className="owner-name-and-days-container">
                <div className="owner-name">{getUserName(disscussion.owner)}</div>
                <div className="days-ago">
                  {getDaysAgo(date, disscussion.createTime)}
                </div>
              </div>
            </div>
          )}
          <div className="discussion-information-wrapper">
            <div className="discussion-name" title={disscussion.title}>
              {disscussion.title}
            </div>
          </div>
        </div>

        {expanded && (
          <div className="description-container">
            <p className="description">{disscussion.message}</p>
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
          commonId={commonId}
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
