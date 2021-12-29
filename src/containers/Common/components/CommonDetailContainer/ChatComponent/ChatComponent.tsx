import React, { useState } from "react";

import { Share } from "../../../../../shared/components";
import { DiscussionMessage } from "@/shared/models";
import ChatMessage from "./ChatMessage";
import "./index.scss";
import { formatDate } from "@/shared/utils";
import { Colors } from "@/shared/constants";

interface ChatComponentInterface {
  discussionMessage: DiscussionMessage[];
  onOpenJoinModal: () => void;
  isCommonMember?: boolean;
  isJoiningPending: boolean;
  isAuthorized?: boolean;
  sendMessage?: (text: string) => void;
}

function groupday(acc: any, currentValue: DiscussionMessage): Messages {
  let d = new Date(currentValue.createTime.seconds * 1000);
  const i = Math.floor(d.getTime() / (1000 * 60 * 60 * 24));
  const timestamp = i * (1000 * 60 * 60 * 24);
  acc[timestamp] = acc[timestamp] || [];
  acc[timestamp].push(currentValue);
  return acc;
}

const isToday = (someDate: Date) => {
  const today = new Date();
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};

interface Messages {
  [key: number]: DiscussionMessage[];
}

export default function ChatComponent({
  discussionMessage,
  onOpenJoinModal,
  isCommonMember,
  isJoiningPending,
  isAuthorized,
  sendMessage,
}: ChatComponentInterface) {
  const [message, setMessage] = useState("");
  const shouldAllowJoiningToCommon = !isCommonMember && !isJoiningPending;
  const messages = discussionMessage.reduce(groupday, {});

  const dateList = Object.keys(messages);

  return (
    <div className="chat-wrapper">
      <div className="messages">
        {dateList.map((day) => {
          const date = new Date(Number(day));
          return (
            <div className="date" key={day}>
              <div className="title">
                {isToday(date) ? "Today" : formatDate(date)}
              </div>
              <div className="message-list">
                {messages[Number(day)].map((m) => {
                  return <ChatMessage key={m.id} disscussionMessage={m} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
      {!isAuthorized ? (
        <div className="bottom-chat-wrapper">
          <div className="text">
            Download the Common app to join the discussion
          </div>
          <div className="button-wrapper">
            {shouldAllowJoiningToCommon && (
              <button
                className="button-blue join-the-effort-btn"
                onClick={onOpenJoinModal}
              >
                Join the effort
              </button>
            )}
            <Share type="popup" color={Colors.lightPurple} top="-130px" />
          </div>
        </div>
      ) : (
        <div className="bottom-chat-wrapper">
          <input
            className="message-input"
            placeholder="What do you think?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div
            className="button-blue send"
            onClick={() => {
              sendMessage && sendMessage(message);
              setMessage("");
            }}
          >
            Send
          </div>
        </div>
      )}
    </div>
  );
}
