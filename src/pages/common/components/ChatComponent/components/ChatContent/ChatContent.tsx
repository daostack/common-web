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
import { ChatMessage, InternalLinkData } from "@/shared/components";
import {
  ChatType,
  LOADER_APPEARANCE_DELAY,
  QueryParamKey,
} from "@/shared/constants";
import { useForceUpdate, useQueryParams } from "@/shared/hooks";
import {
  checkIsUserDiscussionMessage,
  CommonFeedObjectUserUnique,
  CommonMember,
  DirectParent,
  DiscussionMessage,
  User,
  Circles,
} from "@/shared/models";
import { Loader } from "@/shared/ui-kit";
import { formatDate } from "@/shared/utils";
import { Separator } from "./components";
import { checkIsLastSeenInPreviousDay } from "./utils";
import styles from "./ChatContent.module.scss";

export interface ChatContentRef {
  scrollToContainerBottom: () => void;
}

interface ChatContentInterface {
  type: ChatType;
  commonMember: CommonMember | null;
  governanceCircles?: Circles;
  chatWrapperId: string;
  messages: Record<number, DiscussionMessage[]>;
  dateList: string[];
  lastSeenItem?: CommonFeedObjectUserUnique["lastSeen"];
  hasPermissionToHide: boolean;
  users: User[];
  discussionId: string;
  feedItemId: string;
  isLoading: boolean;
  onMessageDelete?: (messageId: string) => void;
  directParent?: DirectParent | null;
  onUserClick?: (userId: string) => void;
  onFeedItemClick?: (feedItemId: string) => void;
  onInternalLinkClick?: (data: InternalLinkData) => void;
  isEmpty?: boolean;
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
    governanceCircles,
    chatWrapperId,
    messages,
    dateList,
    lastSeenItem,
    hasPermissionToHide,
    users,
    discussionId,
    feedItemId,
    isLoading,
    onMessageDelete,
    directParent,
    onUserClick,
    onFeedItemClick,
    onInternalLinkClick,
    isEmpty,
  },
  chatContentRef,
) => {
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const queryParams = useQueryParams();
  const messageIdParam = queryParams[QueryParamKey.Message];
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (messages) {
      console.log(messages);
      forceUpdate();
    }

    if (dateList) {
      console.log(dateList);
      forceUpdate();
    }
  }, [messages, dateList]);

  const [highlightedMessageId, setHighlightedMessageId] = useState(
    () => (typeof messageIdParam === "string" && messageIdParam) || null,
  );

  const [scrolledToMessage, setScrolledToMessage] = useState(false);

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

  const scrollMore = useCallback(
    (toY: number) =>
      setTimeout(
        () =>
          animateScroll.scrollMore(toY, {
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
    if (!highlightedMessageId || dateList.length === 0 || scrolledToMessage)
      return;

    setTimeout(
      () =>
        scroller.scrollTo(highlightedMessageId, {
          containerId: chatWrapperId,
          delay: 0,
          duration: 300,
          offset: -100,
          smooth: true,
        }),
      0,
    );

    setScrolledToMessage(true);
  }, [chatWrapperId, highlightedMessageId, dateList.length, scrolledToMessage]);

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

  useEffect(() => {
    if (typeof messageIdParam === "string") {
      setHighlightedMessageId(messageIdParam);
    }
  }, [messageIdParam]);

  useImperativeHandle(
    chatContentRef,
    () => ({
      scrollToContainerBottom,
    }),
    [scrollToContainerBottom],
  );

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader delay={LOADER_APPEARANCE_DELAY} />
      </div>
    );
  }

  return (
    <>
      {dateListReverse.map((day, dayIndex) => {
        const date = new Date(Number(day));
        const currentMessages = messages[Number(day)];
        const previousDayMessages =
          messages[Number(dateListReverse[dayIndex + 1])] || [];
        const isLastSeenInPreviousDay = checkIsLastSeenInPreviousDay(
          previousDayMessages,
          lastSeenItem?.id,
        );
        const isMyMessageFirst =
          checkIsUserDiscussionMessage(currentMessages[0]) &&
          currentMessages[0].ownerId === userId;
        const newSeparatorEl = (
          <li>
            <Separator>New</Separator>
          </li>
        );

        return (
          <ul id={chatId} className={styles.messageList} key={day}>
            {isLastSeenInPreviousDay && !isMyMessageFirst && newSeparatorEl}
            <li className={styles.dateTitle}>
              {isToday(date) ? "Today" : formatDate(date)}
            </li>
            {currentMessages.map((message, messageIndex) => {
              const nextMessage = currentMessages[messageIndex + 1];
              const isMyMessageNext =
                checkIsUserDiscussionMessage(nextMessage) &&
                nextMessage.ownerId === userId;
              const messageEl = (
                <ChatMessage
                  key={message.id}
                  user={user}
                  discussionMessage={message}
                  chatType={type}
                  scrollToRepliedMessage={scrollToRepliedMessage}
                  highlighted={message.id === highlightedMessageId}
                  hasPermissionToHide={hasPermissionToHide}
                  onMessageDropdownOpen={(isOpen, messageTopPosition = 0) => {
                    const dropdownHeight = 240;
                    const visibleDropdownHeight =
                      window.innerHeight - messageTopPosition;
                    const hasEnoughSpaceForMenu =
                      visibleDropdownHeight >= dropdownHeight;

                    if (isOpen && !hasEnoughSpaceForMenu) {
                      scrollMore(dropdownHeight - visibleDropdownHeight + 20);
                    }
                  }}
                  users={users}
                  feedItemId={feedItemId}
                  commonMember={commonMember}
                  governanceCircles={governanceCircles}
                  onMessageDelete={onMessageDelete}
                  directParent={directParent}
                  onUserClick={onUserClick}
                  onFeedItemClick={onFeedItemClick}
                  onInternalLinkClick={onInternalLinkClick}
                />
              );

              if (
                message.id !== lastSeenItem?.id ||
                messageIndex === currentMessages.length - 1 ||
                isMyMessageNext
              ) {
                return messageEl;
              }

              return (
                <React.Fragment key={message.id}>
                  {messageEl}
                  {newSeparatorEl}
                </React.Fragment>
              );
            })}
          </ul>
        );
      })}
      {!isLoading && isEmpty && (
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
