import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useLayoutEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import isHotkey from "is-hotkey";
import { v4 as uuidv4 } from "uuid";
import { selectUser } from "@/pages/Auth/store/selectors";
import { CreateDiscussionMessageDto } from "@/pages/OldCommon/interfaces";
import {
  clearCurrentDiscussionMessageReply,
  addMessageToDiscussion,
  addMessageToProposal,
} from "@/pages/OldCommon/store/actions";
import { selectCurrentDiscussionMessageReply } from "@/pages/OldCommon/store/selectors";
import { Loader } from "@/shared/components";
import { ButtonIcon } from "@/shared/components/ButtonIcon";
import { ChatType } from "@/shared/constants";
import { HotKeys } from "@/shared/constants/keyboardKeys";
import { useIntersection } from "@/shared/hooks";
import { usePrevious } from "@/shared/hooks";
import { useDiscussionMessagesById } from "@/shared/hooks/useCases";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { SendIcon } from "@/shared/icons";
import CloseIcon from "@/shared/icons/close.icon";
import {
  Common,
  CommonMember,
  Discussion,
  DiscussionMessage,
  Proposal,
} from "@/shared/models";
import { ChatContent } from "./components/ChatContent";
import "./index.scss";

interface ChatComponentInterface {
  common: Common | null;
  type: ChatType;
  commonMember: CommonMember | null;
  isCommonMemberFetched: boolean;
  isJoiningPending?: boolean;
  isAuthorized?: boolean;
  highlightedMessageId?: string | null;
  hasAccess?: boolean;
  isHidden: boolean;
  proposal?: Proposal;
  discussion: Discussion;
  titleHeight?: number;
}

interface Messages {
  [key: number]: DiscussionMessage[];
}

function groupday(acc: any, currentValue: DiscussionMessage): Messages {
  const d = new Date(currentValue.createdAt.seconds * 1000);
  const i = Math.floor(d.getTime() / (1000 * 60 * 60 * 24));
  const timestamp = i * (1000 * 60 * 60 * 24);
  acc[timestamp] = acc[timestamp] || [];
  acc[timestamp].push(currentValue);
  return acc;
}

export default function ChatComponent({
  common,
  type,
  commonMember,
  isCommonMemberFetched,
  isJoiningPending,
  isAuthorized,
  highlightedMessageId: linkHighlightedMessageId,
  hasAccess = true,
  isHidden = false,
  proposal,
  discussion,
  titleHeight = 0,
}: ChatComponentInterface) {
  const intersectionRef = React.useRef(null);
  const replyDivRef = React.useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 0,
  });

  const dispatch = useDispatch();
  const {
    fetchDiscussionMessages,
    data: discussionMessages = [],
    fetched: isFetchedDiscussionMessages,
  } = useDiscussionMessagesById();
  const prevDiscussionMessages = usePrevious<DiscussionMessage[]>(
    discussionMessages ?? [],
  );
  const user = useSelector(selectUser());
  const discussionMessageReply = useSelector(
    selectCurrentDiscussionMessageReply(),
  );
  const discussionId = discussion.id;

  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (discussionId) {
      fetchDiscussionMessages(discussionId);
    }
  }, [discussionId]);

  useLayoutEffect(() => {
    setHeight(
      (replyDivRef.current as unknown as { clientHeight: number })
        ?.clientHeight || 0,
    );
  }, [discussionMessageReply]);

  const [message, setMessage] = useState("");
  const messages = (discussionMessages ?? []).reduce(groupday, {});
  const [isNewMessageLoading, setIsNewMessageLoading] =
    useState<boolean>(false);
  const isTabletView = useIsTabletView();
  const dateList = Object.keys(messages);
  const chatWrapperId = useMemo(() => `chat-wrapper-${uuidv4()}`, []);

  const addMessageByType = useCallback(
    (payload: CreateDiscussionMessageDto) => {
      switch (type) {
        case ChatType.ProposalComments: {
          if (proposal) {
            dispatch(addMessageToProposal.request({ payload, proposal }));
          }
          break;
        }
        case ChatType.DiscussionMessages: {
          if (discussion) {
            dispatch(addMessageToDiscussion.request({ payload, discussion }));
          }
          break;
        }
      }
    },
    [discussion, proposal, type],
  );

  const sendMessage = useCallback(
    (message: string) => {
      if (user && user.uid && common?.id) {
        const payload: CreateDiscussionMessageDto = {
          text: message,
          ownerId: user.uid,
          commonId: common?.id,
          discussionId,
          ...(discussionMessageReply && {
            parentId: discussionMessageReply?.id,
          }),
        };

        addMessageByType(payload);

        if (discussionMessageReply) {
          dispatch(clearCurrentDiscussionMessageReply());
        }
      }
    },
    [dispatch, user, discussionMessageReply, common, discussionId],
  );

  const sendChatMessage = (): void => {
    if (message) {
      setIsNewMessageLoading(true);
      sendMessage && sendMessage(message.trim());
      setMessage("");
    }
  };

  const onEnterKeyDown = (event: React.KeyboardEvent<HTMLElement>): void => {
    if (isHotkey(HotKeys.Enter, event)) {
      event.preventDefault();
      sendChatMessage();
    } else if (isHotkey(HotKeys.ModEnter || HotKeys.ShiftEnter, event)) {
      setMessage(message + "\r\n");
    }
  };

  useEffect(() => {
    if (
      !prevDiscussionMessages ||
      prevDiscussionMessages?.length === discussionMessages?.length
    )
      return;

    setIsNewMessageLoading(false);
  }, [
    discussionMessages?.length,
    prevDiscussionMessages,
    prevDiscussionMessages?.length,
    setIsNewMessageLoading,
  ]);

  const chatWrapperStyle = useMemo(() => {
    if (isTabletView) {
      return { height: `calc(100% - 48px)` };
    }

    return { height: `calc(100% - ${52 + height}px - ${titleHeight}px)` };
  }, [height, isTabletView, titleHeight]);
  const chatInputStyle = useMemo(() => ({ minHeight: 82 + height }), [height]);

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
        {isFetchedDiscussionMessages ? (
          <ChatContent
            discussionMessages={discussionMessages}
            prevDiscussionMessages={prevDiscussionMessages}
            linkHighlightedMessageId={linkHighlightedMessageId}
            type={type}
            commonMember={commonMember}
            isCommonMemberFetched={isCommonMemberFetched}
            isJoiningPending={isJoiningPending}
            hasAccess={hasAccess}
            isHidden={isHidden}
            chatWrapperId={chatWrapperId}
            isNewMessageLoading={isNewMessageLoading}
            messages={messages}
            dateList={dateList}
          />
        ) : (
          <div className="loader-container">
            <Loader />
          </div>
        )}
      </div>
      {isAuthorized && (
        <div ref={intersectionRef} style={chatInputStyle}>
          <MessageReply />
          <div
            className={classNames("bottom-chat-wrapper", {
              "bottom-chat-wrapper__fixed": !(
                Number(intersection?.intersectionRatio) > 0
              ),
            })}
          >
            {!commonMember || !hasAccess || isHidden ? (
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
                  <SendIcon />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
