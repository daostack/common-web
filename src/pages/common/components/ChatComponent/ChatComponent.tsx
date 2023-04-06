import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "react-use";
import classNames from "classnames";
import isHotkey from "is-hotkey";
import { delay } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { selectUser } from "@/pages/Auth/store/selectors";
import { DiscussionMessageService } from "@/services";
import { Loader } from "@/shared/components";
import {
  ChatType,
  GovernanceActions,
  LastSeenEntity,
} from "@/shared/constants";
import { HotKeys } from "@/shared/constants/keyboardKeys";
import {
  useDiscussionMessagesById,
  useMarkFeedItemAsSeen,
} from "@/shared/hooks/useCases";
import { SendIcon } from "@/shared/icons";
import { CreateDiscussionMessageDto } from "@/shared/interfaces/api/discussionMessages";
import {
  Common,
  CommonFeedObjectUserUnique,
  CommonMember,
  Discussion,
  DiscussionMessage,
  Timestamp,
} from "@/shared/models";
import { getUserName, hasPermission } from "@/shared/utils";
import {
  cacheActions,
  chatActions,
  selectGovernance,
  selectCurrentDiscussionMessageReply,
} from "@/store/states";
import { ChatContent, MessageReply } from "./components";
import { getLastNonUserMessage } from "./utils";
import styles from "./ChatComponent.module.scss";

interface ChatComponentInterface {
  common: Common | null;
  type: ChatType;
  isCommonMemberFetched: boolean;
  commonMember: CommonMember | null;
  hasAccess?: boolean;
  discussion: Discussion;
  lastSeenItem?: CommonFeedObjectUserUnique["lastSeen"];
  feedItemId: string;
  isAuthorized?: boolean;
  isHidden: boolean;
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
  discussion,
  hasAccess = true,
  lastSeenItem,
  feedItemId,
  isAuthorized,
  isHidden = false,
  isCommonMemberFetched,
}: ChatComponentInterface) {
  const dispatch = useDispatch();
  const governance = useSelector(selectGovernance);
  const discussionMessageReply = useSelector(
    selectCurrentDiscussionMessageReply(),
  );
  const chatWrapperId = useMemo(() => `chat-wrapper-${uuidv4()}`, []);
  const { markFeedItemAsSeen } = useMarkFeedItemAsSeen();

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
    addDiscussionMessage,
  } = useDiscussionMessagesById({
    hasPermissionToHide,
  });
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const discussionId = discussion.id;

  const lastNonUserMessage = getLastNonUserMessage(
    discussionMessages || [],
    userId,
  );

  const messages = (discussionMessages ?? []).reduce(groupday, {});
  const dateList = Object.keys(messages);

  useEffect(() => {
    if (discussionId) {
      fetchDiscussionMessages(discussionId);
    }
  }, [discussionId]);

  const [message, setMessage] = useState("");

  const [newMessages, setMessages] = useState<CreateDiscussionMessageDto[]>([]);

  useDebounce(
    () => {
      newMessages.map((payload, index) => {
        delay(async () => {
          const response = await DiscussionMessageService.createMessage(
            payload,
          );

          dispatch(
            cacheActions.updateDiscussionMessageWithActualId({
              discussionId,
              pendingMessageId: payload.pendingMessageId as string,
              actualId: response.id,
            }),
          );
        }, 2000 * index);
        return payload;
      });
      setMessages([]);
    },
    1500,
    [JSON.stringify(newMessages), discussionId, dispatch],
  );

  const sendMessage = useCallback(
    async (message: string) => {
      if (user && user.uid && common?.id) {
        const pendingMessageId = uuidv4();
        const payload: CreateDiscussionMessageDto = {
          pendingMessageId,
          text: message,
          ownerId: user.uid,
          commonId: common?.id,
          discussionId,
          ...(discussionMessageReply && {
            parentId: discussionMessageReply?.id,
          }),
        };
        const firebaseDate = Timestamp.fromDate(new Date());

        const msg = {
          id: pendingMessageId,
          owner: user,
          ownerAvatar: (user.photo || user.photoURL) as string,
          ownerId: userId as string,
          ownerName: getUserName(user),
          text: message,
          commonId: common?.id,
          discussionId,
          createdAt: firebaseDate,
          updatedAt: firebaseDate,
          parentMessage: discussionMessageReply?.id
            ? {
                id: discussionMessageReply?.id,
                ownerName: discussionMessageReply.ownerName,
                text: discussionMessageReply.text,
              }
            : null,
        };

        setMessages((prev) => [...prev, payload]);
        addDiscussionMessage(discussionId, msg);

        if (discussionMessageReply) {
          dispatch(chatActions.clearCurrentDiscussionMessageReply());
        }
      }
    },
    [
      dispatch,
      user,
      discussionMessageReply,
      common,
      discussionId,
      discussionMessages,
    ],
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

  return (
    <div className={styles.chatWrapper}>
      <div
        className={classNames(styles.messages, {
          [styles.emptyChat]: !dateList.length,
        })}
        id={chatWrapperId}
      >
        {isFetchedDiscussionMessages ? (
          <ChatContent
            type={type}
            commonMember={commonMember}
            isCommonMemberFetched={isCommonMemberFetched}
            isJoiningPending={false}
            hasAccess={hasAccess}
            isHidden={false}
            chatWrapperId={chatWrapperId}
            messages={messages}
            dateList={dateList}
            lastSeenItem={lastSeenItem}
            hasPermissionToHide={hasPermissionToHide}
          />
        ) : (
          <div className={styles.loaderContainer}>
            <Loader />
          </div>
        )}
      </div>
      {isAuthorized && (
        <>
          <MessageReply />
          <div className={styles.bottomChatWrapper}>
            {!commonMember || !hasAccess || isHidden ? (
              <span className={styles.permissionsText}>
                Only members can send messages
              </span>
            ) : (
              <>
                <textarea
                  className={styles.messageInput}
                  placeholder="What do you think?"
                  value={message}
                  onKeyDown={onEnterKeyDown}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  className={styles.send}
                  onClick={sendChatMessage}
                  disabled={!message.length}
                >
                  <SendIcon />
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
