import React from "react";
import { Loader } from "../../../../../shared/components";
import { Common, Discussion } from "../../../../../graphql";
import { formatPrice, getDaysAgo, getUserInitials, getUserName } from "../../../../../shared/utils";
import "./index.scss";

interface DiscussionDetailModalProps {
  discussion?: Discussion | null;
  common: Common;
}

export default function DiscussionDetailModal({ discussion, common }: DiscussionDetailModalProps) {
  const date = new Date();
  return !discussion ? (
    <Loader />
  ) : (
    <div className="discussion-detail-modal-wrapper">
      <div className="left-side">
        <div className="top-side">
          <div className="countdown-wrapper">
            <div className="inner-wrapper">
              <img className="clock-icon" src="/icons/alarm-clock.svg" alt="alarm-clock" />
              <div className="text">Countdown 08:21:13</div>
            </div>
          </div>
          <div className="owner-wrapper">
            <div className="owner-icon-wrapper">
              <img src={discussion.owner?.photo} alt={getUserName(discussion.owner)} />
            </div>
            <div className="owner-name">{getUserName(discussion.owner)}</div>
            <div className="days-ago">{getDaysAgo(date, discussion.createdAt)} </div>
          </div>
          <div className="discussion-information-wrapper">
            <div className="discussion-name">{discussion.title}</div>
            <div className="requested-amount">
              Requested amount <div className="amount">{formatPrice(common.balance)}</div>
            </div>
          </div>
          <div className="line"></div>
        </div>
        <div className="down-side">
          <p className="description">{discussion.description}</p>
        </div>
      </div>
      <div className="right-side">
        <div className="chat-wrapper">
          {discussion.messages?.map((m: any) => {
            const mDate = new Date(m.createdAt);
            return (
              <div key={m.id} className="message-wrapper">
                <div className="icon-wrapper">
                  {discussion.owner?.photo ? (
                    <img src={m.owner?.photo} alt={getUserName(m.owner)} />
                  ) : (
                    <span
                      className="initials"
                      style={{ backgroundColor: Math.floor(Math.random() * 16777215).toString(16) }}
                    >
                      {getUserInitials(m.owner)}
                    </span>
                  )}
                </div>
                <div className="message-text">
                  <div className="message-name">{getUserName(m.owner)}</div>
                  <div className="message-content">{m.message}</div>
                </div>
                <div className="time-wrapper">{mDate.toLocaleDateString() + "," + mDate.toLocaleTimeString()}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
