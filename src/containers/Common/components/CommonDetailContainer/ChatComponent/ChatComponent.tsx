import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useSelector } from "react-redux";
import { scroller, animateScroll } from "react-scroll";
import classNames from "classnames";
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
import { usePrevious } from "@/shared/hooks";
import "./index.scss";

interface ChatComponentInterface {
  common: Common | null;
  discussionMessage: DiscussionMessage[];
  type: ChatType;
  onOpenJoinModal?: () => void;
  isCommonMember?: boolean;
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
  isJoiningPending,
  isAuthorized,
  sendMessage,
  highlightedMessageId,
}: ChatComponentInterface) {
  const prevDiscussionMessages = usePrevious<DiscussionMessage[]>(discussionMessage);
  const screenSize = useSelector(getScreenSize());
  const [message, setMessage] = useState("");
  const shouldShowJoinToCommonButton = !isCommonMember && !isJoiningPending;
  const messages = discussionMessage.reduce(groupday, {});
  const [isNewMessageLoading, setIsNewMessageLoading] = useState<boolean>(false);
  const [lastMessageWithOpenedDropdownId, setLastMessageWithOpenedDropdownId] = useState<string | null>(null);
  const isMobileView = (screenSize === ScreenSize.Mobile);
  const dateList = Object.keys(messages);
  const chatWrapperId = useMemo(() => `chat-wrapper-${uuidv4()}`, []);
  const chatId = useMemo(() => `chat-${uuidv4()}`, []);

  const scrollToContainerBottom = useCallback(() =>
    setTimeout(
      () =>
        animateScroll.scrollToBottom(
          {
            containerId: chatWrapperId,
            smooth: true,
            delay: 0,
          }
        ),
      0
    ),
    [chatWrapperId]
  );

  useEffect(() => {
    if (!highlightedMessageId)
      scrollToContainerBottom();
  }, [highlightedMessageId, scrollToContainerBottom]);

  useEffect(() => {
    if (
      (
        Boolean(prevDiscussionMessages)
        && (prevDiscussionMessages?.length !== discussionMessage.length)
      )
      || isNewMessageLoading
    ) scrollToContainerBottom();
  }, [
    scrollToContainerBottom,
    prevDiscussionMessages,
    prevDiscussionMessages?.length,
    discussionMessage.length,
    isNewMessageLoading
  ]);

  useEffect(
    () => {
      if (!highlightedMessageId)
        return;

      setTimeout(
        () =>
          scroller.scrollTo(
            highlightedMessageId,
            {
              containerId: chatId,
              delay: 0,
              duration: 300,
              offset: -15,
              smooth: true,
            }
          ),
        0
      );
    },
    [chatId, highlightedMessageId]
  );

  useEffect(() => {
    if (
      !prevDiscussionMessages
      || (prevDiscussionMessages?.length === discussionMessage.length)
    ) return;

    setIsNewMessageLoading(false);
  }, [
    discussionMessage.length,
    prevDiscussionMessages,
    prevDiscussionMessages?.length,
    setIsNewMessageLoading,
  ]);

  return (
    <div className="chat-wrapper">
      <div
        className={`messages ${!dateList.length ? "empty" : ""}`}
        id={chatWrapperId}
      >
        {dateList.map((day, dayIndex) => {
          const date = new Date(Number(day));

          return (
            <ul
              id={chatId}
              className="message-list"
              key={day}
            >
              <li className="date-title">
                {isToday(date) ? "Today" : formatDate(date)}
              </li>
              {
                messages[Number(day)].map((message, messageIndex) =>
                  (
                    <ChatMessage
                      key={message.id}
                      disscussionMessage={message}
                      chatType={type}
                      highlighted={message.id === highlightedMessageId}
                      className={classNames({"last-message-with-dropdown": message.id === lastMessageWithOpenedDropdownId })}
                      onMessageDropdownOpen={
                        (messageIndex === messages[Number(day)].length - 1)
                          ? (isOpen: boolean) => {
                            setLastMessageWithOpenedDropdownId(isOpen ? message.id : null);

                            if(dayIndex === dateList.length - 1)
                              scrollToContainerBottom();
                          }
                          : undefined
                      }
                    />
                  )
                )
              }
            </ul>
          );
        })}
        {(!dateList.length && !isNewMessageLoading) ? (
          <EmptyTabComponent
            currentTab="messages"
            message={
              "Have any thoughts? Share them with other members by adding the first comment."
            }
            title="No comments yet"
            isCommonMember={isCommonMember}
            isJoiningPending={isJoiningPending}
          />
        ) : isNewMessageLoading && (
            <div
              className={
                classNames(
                  "new-message-loader-wrapper",
                  {
                    "very-first-message": !dateList.length,
                  }
                )
              }
            >
              <Loader />
            </div>
          )
        }
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
            {
              common
              ? <CommonShare
                common={common}
                type={
                  isMobileView
                  ? ShareViewType.ModalMobile
                  : ShareViewType.ModalDesktop
                }
                color={Colors.lightPurple}
                top="-130px"
              />
              : <Loader />
            }
          </div>
        </div>
      ) : (
        <div className="bottom-chat-wrapper">
          {!isCommonMember ? <span className="text">Only members can send messages</span> :
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
                  setIsNewMessageLoading(true);
                  sendMessage && sendMessage(message);
                  setMessage("");
                }}
                disabled={!message.length}
              >
                <img src="/icons/send-message.svg" alt="send-message" />
              </button>
            </>
          }
        </div>
      )}
    </div>
  );
}
