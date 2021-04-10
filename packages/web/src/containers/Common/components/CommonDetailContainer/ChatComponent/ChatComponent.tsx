import React from "react";
import { DiscussionMessage } from "../../../../../shared/models";
import { getUserInitials, getUserName } from "../../../../../shared/utils";
import "./index.scss";

interface ChatComponentInterface {
  discussionMessage: DiscussionMessage[];
}

export default function ChatComponent({ discussionMessage }: ChatComponentInterface) {
  return (
    <div className="chat-wrapper">
      {discussionMessage?.map((m) => {
        const mDate = new Date(m.createTime.seconds * 1000);
        return (
          <div className="message-wrapper">
            <div className="icon-wrapper">
              {m.owner?.photoURL ? (
                <img src={m.owner?.photoURL} alt={getUserName(m.owner)} />
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
              <div className="message-content">{m.text}</div>
            </div>
            <div className="time-wrapper">{mDate.toLocaleDateString() + "," + mDate.toLocaleTimeString()}</div>
          </div>
        );
      })}
    </div>
  );
}
