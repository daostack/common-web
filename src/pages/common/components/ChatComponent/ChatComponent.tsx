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
import {
  ChatType,
  GovernanceActions,
  LastSeenEntity,
} from "@/shared/constants";
import { HotKeys } from "@/shared/constants/keyboardKeys";
import { useIntersection } from "@/shared/hooks";
import { usePrevious } from "@/shared/hooks";
import {
  useDiscussionMessagesById,
  useMarkFeedItemAsSeen,
} from "@/shared/hooks/useCases";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { SendIcon } from "@/shared/icons";
import CloseIcon from "@/shared/icons/close.icon";
import {
  Common,
  CommonFeedObjectUserUnique,
  CommonMember,
  Discussion,
  DiscussionMessage,
  PendingMessage,
  PendingMessageStatus,
  Proposal,
} from "@/shared/models";
import { hasPermission } from "@/shared/utils";
import { selectGovernance } from "@/store/states";
import { ChatContent } from "./components/ChatContent";
import { getLastNonUserMessage } from "./utils";
import "./index.scss";

interface ChatComponentInterface {
  common: Common | null;
  type: ChatType;
  commonMember: CommonMember | null;
  isCommonMemberFetched: boolean;
  feedItemId: string;
  isJoiningPending?: boolean;
  isAuthorized?: boolean;
  highlightedMessageId?: string | null;
  hasAccess?: boolean;
  isHidden: boolean;
  proposal?: Proposal;
  discussion: Discussion;
  titleHeight?: number;
  lastSeenItem?: CommonFeedObjectUserUnique["lastSeen"];
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

const CHAT_HOT_KEYS = [HotKeys.Enter, HotKeys.ModEnter, HotKeys.ShiftEnter];

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
  feedItemId,
  titleHeight = 0,
  lastSeenItem,
}: ChatComponentInterface) {
  const intersectionRef = React.useRef(null);
  const replyDivRef = React.useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 0,
  });
  const { markFeedItemAsSeen } = useMarkFeedItemAsSeen();

  const dispatch = useDispatch();
  const governance = useSelector(selectGovernance);

  const hasPermissionToHide =
    commonMember && governance
      ? hasPermission({
          commonMember,
          governance,
          key: GovernanceActions.HIDE_OR_UNHIDE_MESSAGE,
        })
      : false;
  const {
    fetchDiscussionMessages,
    data: discussionMessages = [],
    fetched: isFetchedDiscussionMessages,
  } = useDiscussionMessagesById({
    hasPermissionToHide,
  });
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const discussionMessageReply = useSelector(
    selectCurrentDiscussionMessageReply(),
  );
  const discussionId = discussion.id;
  const lastNonUserMessage = getLastNonUserMessage(
    discussionMessages || [],
    userId,
  );

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
  const isTabletView = useIsTabletView();
  const dateList = Object.keys(messages);
  const chatWrapperId = useMemo(() => `chat-wrapper-${uuidv4()}`, []);
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);

  const prevDiscussionMessages = usePrevious<DiscussionMessage[]>(
    discussionMessages ?? [],
  );

  const prevPendingMessages = usePrevious<PendingMessage[]>(
    pendingMessages ?? [],
  );

  /** Remove the pending message from the pending array only AFTER the FE receives the updated messages array from the BE */
  useEffect(() => {
    if (
      Boolean(prevDiscussionMessages) &&
      discussionMessages?.length !== prevDiscussionMessages?.length
    ) {
      setPendingMessages((prevState) =>
        prevState.filter((msg) => msg.status !== PendingMessageStatus.Success),
      );
    }
  }, [discussionMessages, prevDiscussionMessages]);

  const handleResult = (isSucceed: boolean, pendingMessageId: string) => {
    setPendingMessages((prevState) =>
      prevState.map((msg) => {
        if (msg.id !== pendingMessageId) {
          return msg;
        }
        return {
          ...msg,
          status: isSucceed
            ? PendingMessageStatus.Success
            : PendingMessageStatus.Failed,
        };
      }),
    );
  };

  const addMessageByType = useCallback(
    (payload: CreateDiscussionMessageDto) => {
      const pendingMessageId = uuidv4();

      setPendingMessages((prevState) => [
        ...prevState,
        {
          id: pendingMessageId,
          text: payload.text,
          status: PendingMessageStatus.Sending,
          feedItemId: feedItemId,
        },
      ]);

      switch (type) {
        case ChatType.ProposalComments: {
          if (proposal) {
            dispatch(
              addMessageToProposal.request({
                payload,
                proposal,
                callback(isSucceed) {
                  handleResult(isSucceed, pendingMessageId);
                },
              }),
            );
          }
          break;
        }
        case ChatType.DiscussionMessages: {
          if (discussion) {
            dispatch(
              addMessageToDiscussion.request({
                payload,
                discussion,
                callback(isSucceed) {
                  handleResult(isSucceed, pendingMessageId);
                },
              }),
            );
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
      sendMessage && sendMessage(message.trim());
      setMessage("");
    }
  };

  const onEnterKeyDown = (event: React.KeyboardEvent<HTMLElement>): void => {
    const enteredHotkey = CHAT_HOT_KEYS.find((hotkey) =>
      isHotkey(hotkey, event),
    );

    if (!enteredHotkey) {
      return;
    }

    event.preventDefault();

    if (enteredHotkey === HotKeys.Enter) {
      sendChatMessage();
      return;
    }

    setMessage((currentMessage) => `${currentMessage}\r\n`);
  };

  useEffect(() => {
    if (
      lastNonUserMessage &&
      lastSeenItem?.id !== lastNonUserMessage.id &&
      feedItemId
    ) {
      markFeedItemAsSeen({
        feedObjectId: feedItemId,
        commonId: lastNonUserMessage.commonId,
        lastSeenId: lastNonUserMessage.id,
        type: LastSeenEntity.DiscussionMessage,
      });
    }
  }, [lastNonUserMessage?.id]);

  const chatWrapperStyle = useMemo(() => {
    if (isTabletView) {
      return { height: `calc(100% - ${48 + height}px)` };
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
            linkHighlightedMessageId={linkHighlightedMessageId}
            type={type}
            commonMember={commonMember}
            isCommonMemberFetched={isCommonMemberFetched}
            isJoiningPending={isJoiningPending}
            hasAccess={hasAccess}
            isHidden={isHidden}
            chatWrapperId={chatWrapperId}
            messages={messages}
            dateList={dateList}
            lastSeenItem={lastSeenItem}
            hasPermissionToHide={hasPermissionToHide}
            pendingMessages={pendingMessages}
            prevPendingMessages={prevPendingMessages}
            feedItemId={feedItemId}
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
