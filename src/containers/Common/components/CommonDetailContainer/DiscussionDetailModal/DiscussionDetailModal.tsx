import React, { useState } from "react";

import { Loader } from "../../../../../shared/components";
import { Discussion } from "../../../../../shared/models";
import { getDaysAgo, getUserName } from "../../../../../shared/utils";
import { ChatComponent } from "../ChatComponent";
import "./index.scss";

interface DiscussionDetailModalProps {
  disscussion: Discussion | null;
  onOpenJoinModal: () => void;
}

export default function DiscussionDetailModal({
  disscussion,
  onOpenJoinModal,
}: DiscussionDetailModalProps) {
  const date = new Date();
  const [imageError, setImageError] = useState(false);
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
                  src={disscussion.owner?.photo}
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
        />
      </div>
    </div>
  );
}
