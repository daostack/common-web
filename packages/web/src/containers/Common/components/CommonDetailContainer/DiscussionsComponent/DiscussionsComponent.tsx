import React from "react";
import { Discussion } from "../../../../../graphql";
import { getDaysAgo, getUserName } from "../../../../../shared/utils";
import "./index.scss";

interface DiscussionsComponentProps {
  discussions: Discussion[];
  loadDiscussionDetail: (value: Discussion) => void;
}

export default function DiscussionsComponent({ discussions, loadDiscussionDetail }: DiscussionsComponentProps) {
  const date = new Date();
  return (
    <div className="discussions-component-wrapper">
      {discussions.map((d) => (
        <div className="discussion-item-wrapper" key={d.id} onClick={() => loadDiscussionDetail(d)}>
          <div className="discussion-top-bar">
            <div className="img-wrapper">
              <img src={d.owner?.photo} alt={getUserName(d.owner)} />
            </div>
            <div className="creator-information">
              <div className="name">{getUserName(d.owner)}</div>
              <div className="days-ago">{getDaysAgo(date, d.createdAt)} </div>
            </div>
          </div>
          <div className="discussion-content">
            <div className="title">{d.title}</div>
            <div className="description">{d.description}</div>
            {/* <div className="read-more">Read More</div> */}
            <div className="line"></div>
          </div>
          <div className="bottom-content">
            <div className="discussion-count">
              <img src="/icons/discussions.svg" alt="discussions" />
              <div className="count">{d.messages?.length || 0}</div>
            </div>
            {(d?.messages?.length || 0) > 0 && (
              <div className="view-all-discussions" onClick={() => loadDiscussionDetail(d)}>
                View discussions
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
