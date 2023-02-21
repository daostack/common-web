import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { scroller, animateScroll } from "react-scroll";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import { selectUser } from "@/pages/Auth/store/selectors";
import { EmptyTabComponent } from "@/pages/OldCommon/components/CommonDetailContainer";
import { Loader } from "@/shared/components";
import { ChatMessage } from "@/shared/components";
import { ChatType } from "@/shared/constants";
import {
  CommonFeedObjectUserUnique,
  CommonMember,
  DiscussionMessage,
} from "@/shared/models";
import { formatDate } from "@/shared/utils";
import { Separator } from "./components";
import styles from "./ChatContent.module.scss";

interface ChatContentInterface {
  type: ChatType;
  commonMember: CommonMember | null;
  isCommonMemberFetched: boolean;
  isJoiningPending?: boolean;
  linkHighlightedMessageId?: string | null;
  prevDiscussionMessages?: DiscussionMessage[];
  discussionMessages: DiscussionMessage[] | null;
  hasAccess: boolean;
  isHidden: boolean;
  chatWrapperId: string;
  isNewMessageLoading: boolean;
  messages: Record<number, DiscussionMessage[]>;
  dateList: string[];
  lastSeenItem?: CommonFeedObjectUserUnique["lastSeen"];
  hasPermissionToHide: boolean;
}

const isToday = (someDate: Date) => {
  const today = new Date();
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};

export default function ChatContent({
  type,
  commonMember,
  isCommonMemberFetched,
  isJoiningPending,
  linkHighlightedMessageId,
  prevDiscussionMessages,
  discussionMessages,
  hasAccess,
  isHidden,
  chatWrapperId,
  isNewMessageLoading,
  messages,
  dateList,
  lastSeenItem,
  hasPermissionToHide,
}: ChatContentInterface) {
  const user = useSelector(selectUser());

  const [highlightedMessageId, setHighlightedMessageId] = useState(
    linkHighlightedMessageId,
  );
  const chatId = useMemo(() => `chat-${uuidv4()}`, []);

  const scrollToContainerBottom = useCallback(
    () =>
      setTimeout(
        () =>
          animateScroll.scrollToBottom({
            containerId: chatWrapperId,
            smooth: true,
            delay: 0,
          }),
        0,
      ),
    [chatWrapperId],
  );

  useEffect(() => {
    if (!highlightedMessageId) scrollToContainerBottom();
  }, [highlightedMessageId, scrollToContainerBottom]);

  useEffect(() => {
    if (
      (Boolean(prevDiscussionMessages) &&
        prevDiscussionMessages?.length !== discussionMessages?.length) ||
      isNewMessageLoading
    )
      scrollToContainerBottom();
  }, [
    scrollToContainerBottom,
    prevDiscussionMessages,
    prevDiscussionMessages?.length,
    discussionMessages?.length,
    isNewMessageLoading,
  ]);

  useEffect(() => {
    if (!highlightedMessageId) return;

    setTimeout(
      () =>
        scroller.scrollTo(highlightedMessageId, {
          containerId: chatId,
          delay: 0,
          duration: 300,
          offset: -15,
          smooth: true,
        }),
      0,
    );
  }, [chatId, highlightedMessageId]);

  function scrollToRepliedMessage(messageId: string) {
    scroller.scrollTo(messageId, {
      containerId: chatWrapperId,
      delay: 0,
      duration: 300,
      offset: -100,
      smooth: true,
    });
    setHighlightedMessageId(messageId);
  }

  if (!hasAccess || isHidden) {
    return (
      <EmptyTabComponent
        currentTab="messages"
        message={
          isHidden
            ? "This discussion was hidden due to inappropriate content"
            : "This content is private and visible only to members of the common in specific circles."
        }
        title=""
        isCommonMember={Boolean(commonMember)}
        isCommonMemberFetched={isCommonMemberFetched}
        isJoiningPending={isJoiningPending}
      />
    );
  }

  return (
    <>
      {dateList.map((day, dayIndex) => {
        const date = new Date(Number(day));

        return (
          <ul id={chatId} className={styles.messageList} key={day}>
            <li className={styles.dateTitle}>
              {isToday(date) ? "Today" : formatDate(date)}
            </li>
            {messages[Number(day)].map(
              (message, messageIndex, currentMessages) => {
                const messageEl = (
                  <ChatMessage
                    key={message.id}
                    user={user}
                    discussionMessage={message}
                    chatType={type}
                    scrollToRepliedMessage={scrollToRepliedMessage}
                    highlighted={message.id === highlightedMessageId}
                    hasPermissionToHide={hasPermissionToHide}
                    onMessageDropdownOpen={
                      messageIndex === messages[Number(day)].length - 1
                        ? () => {
                            if (dayIndex === dateList.length - 1)
                              scrollToContainerBottom();
                          }
                        : undefined
                    }
                  />
                );

                if (
                  message.id !== lastSeenItem?.id ||
                  messageIndex === currentMessages.length - 1
                ) {
                  return messageEl;
                }

                return (
                  <React.Fragment key={message.id}>
                    {messageEl}
                    <li>
                      <Separator>New</Separator>
                    </li>
                  </React.Fragment>
                );
              },
            )}
          </ul>
        );
      })}
      {!dateList.length && !isNewMessageLoading ? (
        <p className={styles.noMessagesText}>
          There are no messages here yet.
          <br />
          Type in the text box to share your thoughts and begin the
          conversation.
        </p>
      ) : (
        isNewMessageLoading && (
          <div
            className={classNames(styles.newMessageLoaderWrapper, {
              [styles.veryFirstMessage]: !dateList.length,
            })}
          >
            <Loader />
          </div>
        )
      )}
    </>
  );
}
