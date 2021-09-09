import React, { useState } from "react";

import { useCalculateReadMoreLength } from "../../../../../shared/hooks";
import { Discussion } from "../../../../../shared/models";
import { getUserName, getDaysAgo } from "../../../../../shared/utils";

interface DiscussionItemComponentProps {
  discussion: Discussion;
  loadDisscussionDetail: (payload: Discussion) => void;
}

export default function DiscussionItemComponent({ discussion, loadDisscussionDetail }: DiscussionItemComponentProps) {
  const [imageError, setImageError] = useState(false);
  // const [readMore, setReadMore] = useState("");
  const date = new Date();
  const textLength = useCalculateReadMoreLength();
  return (
    <div className="discussion-item-wrapper">
      <div className="discussion-top-bar">
        <div className="img-wrapper">
          {!imageError ? (
            <img
              src={discussion.owner?.photo}
              alt={getUserName(discussion.owner)}
              onError={() => setImageError(true)}
            />
          ) : (
            <img src="/icons/default_user.svg" alt={getUserName(discussion.owner)} />
          )}
        </div>
        <div className="creator-information">
          <div className="name">{getUserName(discussion.owner)}</div>
          <div className="days-ago">{getDaysAgo(date, discussion.createdAt)} </div>
        </div>
      </div>
      <div className="discussion-content">
        <div className="title" onClick={() => loadDisscussionDetail(discussion)} title={discussion.title}>
          {discussion.title}
        </div>
        <div className={`description `}>{discussion.message}</div>
        {discussion.description.length > textLength ? (
          <div className="read-more" onClick={() => loadDisscussionDetail(discussion)}>
            Read More
          </div>
        ) : null}
        <div className="line"></div>
      </div>
      <div className="bottom-content">
        <div className="discussion-count">
          <img src="/icons/discussions.svg" alt="discussions" />
          <div className="count">{discussion.messages?.length || 0}</div>
        </div>
        <div className="view-all-discussions" onClick={() => loadDisscussionDetail(discussion)}>
          View discussion
        </div>
      </div>
    </div>
  );
}
