import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useLayoutEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { scroller, animateScroll } from "react-scroll";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import { selectUser } from "@/pages/Auth/store/selectors";
import { EmptyTabComponent } from "@/pages/OldCommon/components/CommonDetailContainer";
import { clearCurrentDiscussionMessageReply } from "@/pages/OldCommon/store/actions";
import { selectCurrentDiscussionMessageReply } from "@/pages/OldCommon/store/selectors";
import { CommonShare, Loader } from "@/shared/components";
import { ButtonIcon } from "@/shared/components/ButtonIcon";
import {
  Colors,
  ShareViewType,
  ScreenSize,
  ChatType,
} from "@/shared/constants";
import { KeyboardKeys } from "@/shared/constants/keyboardKeys";
import { useIntersection } from "@/shared/hooks";
import { usePrevious } from "@/shared/hooks";
import CloseIcon from "@/shared/icons/close.icon";
import { Common, CommonMember, DiscussionMessage } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { formatDate } from "@/shared/utils";
import ChatMessage from "./ChatMessage";
import "./index.scss";

interface ChatComponentInterface {
  common: Common | null;
  discussionMessages: DiscussionMessage[];
  type: ChatType;
  onOpenJoinModal?: () => void;
  commonMember: CommonMember | null;
  isCommonMemberFetched: boolean;
  isJoiningPending?: boolean;
  isAuthorized?: boolean;
  sendMessage?: (text: string) => void;
  highlightedMessageId?: string | null;
  hasAccess?: boolean;
}

function groupday(acc: any, currentValue: DiscussionMessage): Messages {
  const d = new Date(currentValue.createdAt.seconds * 1000);
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
  discussionMessages,
  type,
  onOpenJoinModal,
  commonMember,
  isCommonMemberFetched,
  isJoiningPending,
  isAuthorized,
  sendMessage,
  highlightedMessageId: linkHighlightedMessageId,
  hasAccess = true,
}: ChatComponentInterface) {
  const intersectionRef = React.useRef(null);
  const replyDivRef = React.useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 0,
  });

  const dispatch = useDispatch();
  const prevDiscussionMessages =
    usePrevious<DiscussionMessage[]>(discussionMessages);
  const screenSize = useSelector(getScreenSize());
  const user = useSelector(selectUser());
  const discussionMessageReply = useSelector(
    selectCurrentDiscussionMessageReply(),
  );

  const [height, setHeight] = useState(0);
  const [highlightedMessageId, setHighlightedMessageId] = useState(
    linkHighlightedMessageId,
  );

  useLayoutEffect(() => {
    setHeight(
      (replyDivRef.current as unknown as { clientHeight: number })
        ?.clientHeight || 0,
    );
  }, [discussionMessageReply]);

  const [message, setMessage] = useState("");
  const isSubCommon = Boolean(common?.directParent);
  const shouldShowJoinToCommonButton =
    !commonMember && !isJoiningPending && !isSubCommon;
  const messages = discussionMessages.reduce(groupday, {});
  const [isNewMessageLoading, setIsNewMessageLoading] =
    useState<boolean>(false);
  const isMobileView = screenSize === ScreenSize.Mobile;
  const dateList = Object.keys(messages);
  const chatWrapperId = useMemo(() => `chat-wrapper-${uuidv4()}`, []);
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

  const sendChatMessage = (): void => {
    if (message) {
      setIsNewMessageLoading(true);
      sendMessage && sendMessage(message.trim());
      setMessage("");
    }
  };

  const onEnterKeyDown = (event: React.KeyboardEvent<HTMLElement>): void => {
    if (event.key === KeyboardKeys.Enter && (event.ctrlKey || event.metaKey)) {
      sendChatMessage();
    }
  };

  useEffect(() => {
    if (!highlightedMessageId) scrollToContainerBottom();
  }, [highlightedMessageId, scrollToContainerBottom]);

  useEffect(() => {
    if (
      (Boolean(prevDiscussionMessages) &&
        prevDiscussionMessages?.length !== discussionMessages.length) ||
      isNewMessageLoading
    )
      scrollToContainerBottom();
  }, [
    scrollToContainerBottom,
    prevDiscussionMessages,
    prevDiscussionMessages?.length,
    discussionMessages.length,
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

  useEffect(() => {
    if (
      !prevDiscussionMessages ||
      prevDiscussionMessages?.length === discussionMessages.length
    )
      return;

    setIsNewMessageLoading(false);
  }, [
    discussionMessages.length,
    prevDiscussionMessages,
    prevDiscussionMessages?.length,
    setIsNewMessageLoading,
  ]);

  const chatWrapperStyle = useMemo(
    () => ({ height: `calc(100% - ${90 + height}px)` }),
    [height],
  );
  const chatInputStyle = useMemo(() => ({ minHeight: 82 + height }), [height]);

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

  const MessageReply = useCallback(() => {
    if (!discussionMessageReply) {
      return null;
    }

    return (
      <div
        ref={replyDivRef}
        className={classNames("bottom-reply-wrapper", {
          "bottom-reply-wrapper__fixed": !(
            Number(intersection?.intersectionRatio) > 0
          ),
        })}
      >
        <div className="bottom-reply-message-container">
          <span className="bottom-reply-message-user-name">
            {discussionMessageReply.ownerName}
          </span>
          <p className="bottom-reply-message-text">
            {discussionMessageReply.text}
          </p>
        </div>
        <ButtonIcon
          className="bottom-reply-message-close-button"
          onClick={() => {
            dispatch(clearCurrentDiscussionMessageReply());
          }}
        >
          <CloseIcon fill="#001A36" height={16} width={16} />
        </ButtonIcon>
      </div>
    );
  }, [intersection, discussionMessageReply]);

  return (
    <div className="chat-wrapper" style={chatWrapperStyle}>
      <div
        className={`messages ${!dateList.length ? "empty" : ""}`}
        id={chatWrapperId}
      >
        {hasAccess ? (
          <>
            {dateList.map((day, dayIndex) => {
              const date = new Date(Number(day));

              return (
                <ul id={chatId} className="message-list" key={day}>
                  <li className="date-title">
                    {isToday(date) ? "Today" : formatDate(date)}
                  </li>
                  {messages[Number(day)].map((message, messageIndex) => (
                    <ChatMessage
                      key={message.id}
                      user={user}
                      discussionMessage={message}
                      chatType={type}
                      scrollToRepliedMessage={scrollToRepliedMessage}
                      highlighted={message.id === highlightedMessageId}
                      onMessageDropdownOpen={
                        messageIndex === messages[Number(day)].length - 1
                          ? () => {
                              if (dayIndex === dateList.length - 1)
                                scrollToContainerBottom();
                            }
                          : undefined
                      }
                    />
                  ))}
                </ul>
              );
            })}
            {!dateList.length && !isNewMessageLoading ? (
              <EmptyTabComponent
                currentTab="messages"
                message={
                  "Have any thoughts? Share them with other members by adding the first comment."
                }
                title="No comments yet"
                isCommonMember={Boolean(commonMember)}
                isCommonMemberFetched={isCommonMemberFetched}
                isJoiningPending={isJoiningPending}
              />
            ) : (
              isNewMessageLoading && (
                <div
                  className={classNames("new-message-loader-wrapper", {
                    "very-first-message": !dateList.length,
                  })}
                >
                  <Loader />
                </div>
              )
            )}
          </>
        ) : (
          <EmptyTabComponent
            currentTab="messages"
            message={
              "This content is private and visible only to members of the common in specific circles."
            }
            title=""
            isCommonMember={Boolean(commonMember)}
            isCommonMemberFetched={isCommonMemberFetched}
            isJoiningPending={isJoiningPending}
          />
        )}
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
        <div ref={intersectionRef} style={chatInputStyle}>
          <MessageReply />
          <div
            className={classNames("bottom-chat-wrapper", {
              "bottom-chat-wrapper__fixed": !(
                Number(intersection?.intersectionRatio) > 0
              ),
            })}
          >
            {!commonMember || !hasAccess ? (
              <span className="text">Only members can send messages</span>
            ) : (
              <>
                <textarea
                  className="message-input"
                  placeholder="What do you think?"
                  value={message}
                  onKeyDown={onEnterKeyDown}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  className="send"
                  onClick={sendChatMessage}
                  disabled={!message.length}
                >
                  <img src="/icons/send-message.svg" alt="send-message" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
