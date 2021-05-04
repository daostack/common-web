import React, { useState } from "react";
import { Discussion } from "../../../../../shared/models";
import { getUserName, getDaysAgo } from "../../../../../shared/utils";

interface DiscussionItemComponentProps {
  discussion: Discussion;
  loadDisscussionDetail: Function;
}

export default function DiscussionItemComponent({ discussion, loadDisscussionDetail }: DiscussionItemComponentProps) {
  const [imageError, setImageError] = useState(false);
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
            <img src="/icons/default_user.svg" alt={getUserName(discussion.owner)} />
          )}
        </div>
        <div className="creator-information">
          <div className="name">{getUserName(discussion.owner)}</div>
          <div className="days-ago">{getDaysAgo(date, discussion.createTime)} </div>
        </div>
      </div>
      <div className="discussion-content">
        <div className="title" onClick={() => loadDisscussionDetail(discussion)}>
          {discussion.title}
        </div>
        <div className="description">{discussion.message}</div>
        <div className="read-more" onClick={() => loadDisscussionDetail(discussion)}>
          Read More
        </div>
        <div className="line"></div>
      </div>
      <div className="bottom-content">
        <div className="discussion-count">
          <img src="/icons/discussions.svg" alt="discussions" />
          <div className="count">{discussion.discussionMessage?.length || 0}</div>
        </div>
        {(discussion?.discussionMessage?.length || 0) > 0 && (
          <div className="view-all-discussions" onClick={() => loadDisscussionDetail(discussion)}>
            View discussion
          </div>
        )}
      </div>
    </div>
  );
}
