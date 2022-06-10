import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { scroller } from "react-scroll";
import { v4 as uuidv4 } from "uuid";

import { getScreenSize } from "@/shared/store/selectors";
import { CommonShare, Loader } from "@/shared/components";
import { Common, DiscussionMessage } from "@/shared/models";
import ChatMessage from "./ChatMessage";
import { formatDate } from "@/shared/utils";
import {
  Colors,
  ShareViewType,
  ScreenSize,
  ChatType,
} from "@/shared/constants";
import { EmptyTabComponent } from "@/containers/Common/components/CommonDetailContainer";
import "./index.scss";

interface ChatComponentInterface {
  common: Common | null;
  discussionMessage: DiscussionMessage[];
  type: ChatType;
  onOpenJoinModal?: () => void;
  isCommonMember?: boolean;
  isCommonMemberFetched: boolean;
  isJoiningPending?: boolean;
  isAuthorized?: boolean;
  sendMessage?: (text: string) => void;
  highlightedMessageId?: string | null;
}

function groupday(acc: any, currentValue: DiscussionMessage): Messages {
  const d = new Date(currentValue.createTime.seconds * 1000);
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
  common,
  discussionMessage,
  type,
  onOpenJoinModal,
  isCommonMember,
  isCommonMemberFetched,
  isJoiningPending,
  isAuthorized,
  sendMessage,
  highlightedMessageId,
}: ChatComponentInterface) {
  const screenSize = useSelector(getScreenSize());
  const [message, setMessage] = useState("");
  const shouldShowJoinToCommonButton = !isCommonMember && !isJoiningPending;
  const messages = discussionMessage.reduce(groupday, {});
  const isMobileView = screenSize === ScreenSize.Mobile;
  const dateList = Object.keys(messages);
  const chatId = useMemo(() => `chat-${uuidv4()}`, []);

  useEffect(() => {
    if (!highlightedMessageId) return;

    setTimeout(() => {
      scroller.scrollTo(highlightedMessageId, {
        containerId: chatId,
        delay: 0,
        duration: 300,
        offset: -15,
        smooth: true,
      });
    }, 0);
  }, [chatId, highlightedMessageId]);

  return (
    <div className="chat-wrapper">
      <div className={`messages ${!dateList.length ? "empty" : ""}`}>
        {dateList.map((day) => {
          const date = new Date(Number(day));
          return (
            <ul id={chatId} className="message-list" key={day}>
              <li className="date-title">
                {isToday(date) ? "Today" : formatDate(date)}
              </li>
              {messages[Number(day)].map((m) => {
                return (
                  <ChatMessage
                    key={m.id}
                    disscussionMessage={m}
                    chatType={type}
                    highlighted={m.id === highlightedMessageId}
                  />
                );
              })}
            </ul>
          );
        })}

        {!dateList.length ? (
          <EmptyTabComponent
            currentTab="messages"
            message={
              "Have any thoughts? Share them with other members by adding the first comment."
            }
            title="No comments yet"
            isCommonMember={isCommonMember}
            isCommonMemberFetched={isCommonMemberFetched}
            isJoiningPending={isJoiningPending}
          />
        ) : null}
      </div>
      {!isAuthorized ? (
        <div className="bottom-chat-wrapper">
          <div className="button-wrapper">
            {shouldShowJoinToCommonButton && (
              <button
                className="button-blue join-the-effort-btn"
                onClick={onOpenJoinModal}
              >
                Join the effort
              </button>
            )}
            {common ? (
              <CommonShare
                common={common}
                type={
                  isMobileView
                    ? ShareViewType.ModalMobile
                    : ShareViewType.ModalDesktop
                }
                color={Colors.lightPurple}
                top="-130px"
              />
            ) : (
              <Loader />
            )}
          </div>
        </div>
      ) : (
        <div className="bottom-chat-wrapper">
          {!isCommonMember ? (
            <span className="text">Only members can send messages</span>
          ) : (
            <>
              <input
                className="message-input"
                placeholder="What do you think?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className="send"
                onClick={() => {
                  sendMessage && sendMessage(message);
                  setMessage("");
                }}
                disabled={!message.length}
              >
                <img src="/icons/send-message.svg" alt="send-message" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
