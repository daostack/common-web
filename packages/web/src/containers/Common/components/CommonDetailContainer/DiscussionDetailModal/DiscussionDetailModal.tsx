import React from "react";
import { Loader } from "../../../../../shared/components";
import { Common, Discussion } from "../../../../../shared/models";
import { getDaysAgo, getUserName } from "../../../../../shared/utils";
import { ChatComponent } from "../ChatComponent";
import "./index.scss";

interface DiscussionDetailModalProps {
  disscussion: Discussion | null;
  common: Common;
}

export default function DiscussionDetailModal({ disscussion, common }: DiscussionDetailModalProps) {
  const date = new Date();
  return !disscussion ? (
    <Loader />
  ) : (
    <div className="discussion-detail-modal-wrapper">
      <div className="left-side">
        <div className="top-side">
          <div className="owner-wrapper">
            <div className="owner-icon-wrapper">
              <img src={disscussion.owner?.photoURL} alt={getUserName(disscussion.owner)} />
            </div>
            <div className="owner-name">{getUserName(disscussion.owner)}</div>
            <div className="days-ago">{getDaysAgo(date, disscussion.createTime)} </div>
          </div>
          <div className="discussion-information-wrapper">
            <div className="discussion-name">{disscussion.title}</div>
          </div>
          <div className="line"></div>
        </div>
        <div className="down-side">
          <p className="description">{disscussion.message}</p>
        </div>
      </div>
      <div className="right-side">
        <ChatComponent discussionMessage={disscussion.discussionMessage || []} />
      </div>
    </div>
  );
}
