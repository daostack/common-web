import React, { useCallback, useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { selectUser } from "@/pages/Auth/store/selectors";
import { CreateDiscussionMessageDto } from "@/pages/Common/interfaces";
import {
  addMessageToDiscussion,
  clearCurrentDiscussionMessageReply,
} from "@/pages/Common/store/actions";
import { getCommonGovernanceCircles } from "@/pages/Common/store/api";
import { selectCurrentDiscussionMessageReply } from "@/pages/Common/store/selectors";
import { Loader } from "@/shared/components";
import { ScreenSize, ChatType } from "@/shared/constants";
import {
  Common,
  CommonMember,
  Discussion,
  DiscussionWithHighlightedMessage,
  Governance,
  isDiscussionWithHighlightedMessage,
} from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import {
  getCirclesWithLowestTier,
  getDaysAgo,
  getUserName,
} from "@/shared/utils";
import { getFilteredByIdCircles } from "@/shared/utils/circles";
import { ChatComponent } from "../ChatComponent";
import "./index.scss";

interface DiscussionDetailModalProps {
  discussion: Discussion | DiscussionWithHighlightedMessage | null;
  common: Common;
  onOpenJoinModal: () => void;
  commonMember: CommonMember | null;
  isCommonMemberFetched: boolean;
  isJoiningPending: boolean;
  governance: Governance;
}

export default function DiscussionDetailModal({
  discussion,
  common,
  onOpenJoinModal,
  commonMember,
  isCommonMemberFetched,
  isJoiningPending,
  governance,
}: DiscussionDetailModalProps) {
  const dispatch = useDispatch();
  const date = new Date();
  const user = useSelector(selectUser());
  const currentDiscussionMessageReply = useSelector(
    selectCurrentDiscussionMessageReply(),
  );
  const screenSize = useSelector(getScreenSize());
  const [expanded, setExpanded] = useState(true);
  const [circleNames, setCircleNames] = useState("");
  const highlightedMessageId = useMemo(
    () =>
      isDiscussionWithHighlightedMessage(discussion)
        ? discussion.highlightedMessageId
        : null,
    [discussion],
  );

  useEffect(() => {
    if (discussion?.circleVisibility) {
      (async () => {
        const governanceCircles = await getCommonGovernanceCircles(
          governance.id,
        );
        const filteredByIdCircles = getFilteredByIdCircles(
          governanceCircles ? Object.values(governanceCircles) : null,
          discussion?.circleVisibility,
        );
        const names = getCirclesWithLowestTier(filteredByIdCircles)
          .map(({ name }) => name)
          .join(", ");
        setCircleNames(names);
      })();
    }

    return () => {
      dispatch(clearCurrentDiscussionMessageReply());
    };
  }, [governance.id, discussion]);

  const sendMessage = useCallback(
    (message: string) => {
      if (discussion && user && user.uid) {
        const payload: CreateDiscussionMessageDto = {
          text: message,
          ownerId: user.uid,
          commonId: discussion.commonId,
          discussionId: discussion.id,
          ...(currentDiscussionMessageReply && {
            parentId: currentDiscussionMessageReply?.id,
          }),
        };

        dispatch(
          addMessageToDiscussion.request({ payload, discussion: discussion }),
        );

        if (currentDiscussionMessageReply) {
          dispatch(clearCurrentDiscussionMessageReply());
        }
      }
    },
    [dispatch, user, discussion, currentDiscussionMessageReply],
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

        {circleNames && (
          <div className="description-container">
            <p className="description">{`Limited to: ${circleNames}`}</p>
          </div>
        )}

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
