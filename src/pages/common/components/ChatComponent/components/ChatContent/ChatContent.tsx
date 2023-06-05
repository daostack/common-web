import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  ForwardRefRenderFunction,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useSelector } from "react-redux";
import { scroller, animateScroll } from "react-scroll";
import { v4 as uuidv4 } from "uuid";
import { selectUser } from "@/pages/Auth/store/selectors";
import { EmptyTabComponent } from "@/pages/OldCommon/components/CommonDetailContainer";
import { Loader } from "@/shared/components";
import { ChatMessage } from "@/shared/components";
import { ChatType } from "@/shared/constants";
import {
  CommonFeedObjectUserUnique,
  CommonMember,
  CommonMemberWithUserInfo,
  DiscussionMessage,
} from "@/shared/models";
import { formatDate } from "@/shared/utils";
import { Separator } from "./components";
import styles from "./ChatContent.module.scss";

export interface ChatContentRef {
  scrollToContainerBottom: () => void;
}

interface ChatContentInterface {
  type: ChatType;
  commonMember: CommonMember | null;
  isCommonMemberFetched: boolean;
  isJoiningPending?: boolean;
  linkHighlightedMessageId?: string | null;
  hasAccess: boolean;
  isHidden: boolean;
  chatWrapperId: string;
  messages: Record<number, DiscussionMessage[]>;
  dateList: string[];
  lastSeenItem?: CommonFeedObjectUserUnique["lastSeen"];
  hasPermissionToHide: boolean;
  commonMembers: CommonMemberWithUserInfo[];
  discussionId: string;
  feedItemId: string;
  isLoading: boolean;
}

const isToday = (someDate: Date) => {
  const today = new Date();
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};

const ChatContent: ForwardRefRenderFunction<
  ChatContentRef,
  ChatContentInterface
> = (
  {
    type,
    commonMember,
    isCommonMemberFetched,
    isJoiningPending,
    linkHighlightedMessageId,
    hasAccess,
    isHidden,
    chatWrapperId,
    messages,
    dateList,
    lastSeenItem,
    hasPermissionToHide,
    commonMembers,
    discussionId,
    feedItemId,
    isLoading,
  },
  chatContentRef,
) => {
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

  const dateListReverse = useMemo(() => [...dateList].reverse(), [dateList]);

  useEffect(() => {
    if (!highlightedMessageId) {
      scrollToContainerBottom();
    }
  }, [highlightedMessageId, scrollToContainerBottom, discussionId]);

  useEffect(() => {
    if (!highlightedMessageId) return;

    setTimeout(
      () =>
        scroller.scrollTo(highlightedMessageId, {
          containerId: chatId,
          delay: 0,
          duration: 100,
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

  useImperativeHandle(
    chatContentRef,
    () => ({
      scrollToContainerBottom,
    }),
    [scrollToContainerBottom],
  );

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

  if (isLoading) {
    <div className={styles.loaderContainer}>
      <Loader />
    </div>;
  }

  return (
    <>
      {dateListReverse.map((day, dayIndex) => {
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
                    commonMembers={commonMembers}
                    feedItemId={feedItemId}
                    commonMember={commonMember}
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
      {!dateList.length && (
        <p className={styles.noMessagesText}>
          There are no messages here yet.
          <br />
          Type in the text box to share your thoughts and begin the
          conversation.
        </p>
      )}
    </>
  );
};

export default forwardRef(ChatContent);
