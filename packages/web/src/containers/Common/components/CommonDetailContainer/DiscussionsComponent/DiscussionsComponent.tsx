import React from "react";
import { Discussion } from "../../../../../shared/models";
import { getDaysAgo, getUserName } from "../../../../../shared/utils";
import "./index.scss";

interface DiscussionsComponentProps {
  discussions: Discussion[];
}

export default function DiscussionsComponent({ discussions }: DiscussionsComponentProps) {
  const date = new Date();
  return (
    <div className="discussions-component-wrapper">
      {discussions.map((d) => (
        <div className="discussion-item-wrapper" key={d.id}>
          <div className="discussion-top-bar">
            <div className="img-wrapper">
              <img src={d.owner?.photoURL} alt={getUserName(d.owner)} />
            </div>
            <div className="creator-information">
              <div className="name">{getUserName(d.owner)}</div>
              <div className="days-ago">{getDaysAgo(date, d.createTime)} </div>
            </div>
          </div>
          <div className="discussion-content">
            <div className="title">{d.title}</div>
            <div className="description">{d.message}</div>
            {/* <div className="read-more">Read More</div> */}
            <div className="line"></div>
          </div>
          <div className="bottom-content">
            <div className="discussion-count">
              <img src="/icons/discussions.svg" alt="discussions" />
              <div className="count">{d.discussionMessage?.length || 0}</div>
            </div>
            {(d?.discussionMessage?.length || 0) > 0 && <div className="view-all-discussions">View discussions</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
