import React, { useState } from "react";
import { DiscussionMessage } from "../../../../../shared/models";
import { getUserName, getUserInitials } from "../../../../../shared/utils";

interface ChatMessageProps {
  disscussionMessage: DiscussionMessage;
}

export default function ChatMessage({ disscussionMessage }: ChatMessageProps) {
  const [imageError, setImageError] = useState(false);
  const mDate = new Date(disscussionMessage.createTime.seconds * 1000);
  return (
    <div className="message-wrapper">
      <div className="icon-wrapper">
        {disscussionMessage.owner?.photoURL && !imageError ? (
          <img
            src={disscussionMessage.owner?.photoURL}
            alt={getUserName(disscussionMessage.owner)}
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="initials" style={{ backgroundColor: Math.floor(Math.random() * 16777215).toString(16) }}>
            {getUserInitials(disscussionMessage.owner)}
          </span>
        )}
      </div>
      <div className="message-text">
        <div className="message-name">{getUserName(disscussionMessage.owner)}</div>
        <div className="message-content">{disscussionMessage.text}</div>
      </div>
      <div className="time-wrapper">
        {mDate.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
}
