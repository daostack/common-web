import React, { useEffect, useState } from "react";
import classNames from "classnames";

import { useFullText } from "@/shared/hooks";
import { Discussion, Governance } from "@/shared/models";
import { getUserName, getDaysAgo } from "@/shared/utils";
import { ElementDropdown } from "@/shared/components";
import { DynamicLinkType, ENTITY_TYPES } from "@/shared/constants";
import { getCommonGovernanceCircles } from "@/containers/Common/store/api";
import { getCirclesNames } from "@/shared/utils/circles";

interface DiscussionItemComponentProps {
  discussion: Discussion;
  loadDisscussionDetail: (payload: Discussion) => void;
  governance: Governance;
}

export default function DiscussionItemComponent({
  discussion,
  loadDisscussionDetail,
  governance,
}: DiscussionItemComponentProps) {
  const [imageError, setImageError] = useState(false);
  const [circleNames, setCircleNames] = useState('');
  const {
    ref: messageRef,
    isFullTextShowing,
    shouldShowFullText,
    showFullText,
  } = useFullText();
  const date = new Date();

  useEffect(() => {
    if(discussion.circleVisibility) {
      (async () => {
        const governanceCircles = await getCommonGovernanceCircles(governance.id);
        const names = getCirclesNames(
          governanceCircles ? Object.values(governanceCircles) : null,
          discussion.circleVisibility
        );
        setCircleNames(names);
      })();
    }
  },[governance.id, discussion.circleVisibility])

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
            {getDaysAgo(date, discussion.createdAt)}
          </div>
        </div>
        <ElementDropdown
          entityType={ENTITY_TYPES.Discussion}
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
          {circleNames ? `Limited to: ${circleNames}` : discussion.message}
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
            {discussion.discussionMessages?.length || 0}
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
