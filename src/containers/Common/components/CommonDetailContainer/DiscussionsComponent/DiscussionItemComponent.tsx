import React, { useState } from "react";
import classNames from "classnames";

import { useFullText } from "@/shared/hooks";
import { Discussion } from "@/shared/models";
import { getUserName, getDaysAgo } from "@/shared/utils";
import { ElementDropdown } from "@/shared/components";
import { DynamicLinkType } from "@/shared/constants";

interface DiscussionItemComponentProps {
  discussion: Discussion;
  loadDisscussionDetail: (payload: Discussion) => void;
}

export default function DiscussionItemComponent({
  discussion,
  loadDisscussionDetail,
}: DiscussionItemComponentProps) {
  const [imageError, setImageError] = useState(false);
  const {
    ref: messageRef,
    isFullTextShowing,
    shouldShowFullText,
    showFullText,
  } = useFullText();
  const date = new Date();
  return (
    <div className="discussion-item-wrapper">
      <div className="discussion-top-bar">
        <div className="img-wrapper">
          {!imageError ? (
            <img
              src={discussion.owner?.photoURL}
              alt={getUserName(discussion.owner)}
              onError={() => setImageError(true)}
            />
          ) : (
            <img
              src="/icons/default_user.svg"
              alt={getUserName(discussion.owner)}
            />
          )}
        </div>
        <div className="creator-information">
          <div className="name">{getUserName(discussion.owner)}</div>
          <div className="days-ago">
            {getDaysAgo(date, discussion.createTime)}
          </div>
        </div>
        <ElementDropdown
          linkType={DynamicLinkType.Discussion}
          elem={discussion}
          className="dropdown-menu"
          transparent
        />
      </div>
      <div className="discussion-content">
        <div
          className="title"
          onClick={() => loadDisscussionDetail(discussion)}
          title={discussion.title}
        >
          {discussion.title}
        </div>
        <div
          className={classNames("description", { full: shouldShowFullText })}
          ref={messageRef}
        >
          {discussion.message}
        </div>
        {!isFullTextShowing ? (
          <div className="read-more" onClick={showFullText}>
            Read More
          </div>
        ) : null}
        <div className="line"></div>
      </div>
      <div className="bottom-content">
        <div className="discussion-count">
          <img src="/icons/discussions.svg" alt="discussions" />
          <div className="count">
            {discussion.discussionMessage?.length || 0}
          </div>
        </div>
        <div
          className="view-all-discussions"
          onClick={() => loadDisscussionDetail(discussion)}
        >
          View discussion
        </div>
      </div>
    </div>
  );
}
