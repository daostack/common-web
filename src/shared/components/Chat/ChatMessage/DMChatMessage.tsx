import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import { useDispatch } from "react-redux";
import { usePrevious } from "react-use";
import classNames from "classnames";
import { isEmpty, isEqual } from "lodash";
import { Element } from "slate";
import { useLongPress } from "use-long-press";
import { ChatService, Logger } from "@/services";
import { ElementDropdown, UserAvatar } from "@/shared/components";
import {
  Orientation,
  ChatType,
  EntityTypes,
  QueryParamKey,
} from "@/shared/constants";
import { useRoutesContext } from "@/shared/contexts";
import { useNotification } from "@/shared/hooks";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { ModerationFlags } from "@/shared/interfaces/Moderation";
import {
  CommonMember,
  checkIsSystemDiscussionMessage,
  checkIsUserDiscussionMessage,
  DiscussionMessage,
  User,
  DirectParent,
  Circles,
} from "@/shared/models";
import {
  FilePreview,
  FilePreviewVariant,
  getFileName,
  parseStringToTextEditorValue,
  TextEditorValue,
} from "@/shared/ui-kit";
import { ChatImageGallery } from "@/shared/ui-kit";
import {
  checkIsCheckboxItemElement,
  checkUncheckedItemsInTextEditorValue,
  isRtlWithNoMentions,
} from "@/shared/ui-kit/TextEditor/utils";
import { StaticLinkType, getUserName } from "@/shared/utils";
import { InternalLinkData } from "@/shared/utils";
import { convertBytes } from "@/shared/utils/convertBytes";
import { EditMessageInput } from "../EditMessageInput";
import {
  ChatMessageLinkify,
  ReactWithEmoji,
  Reactions,
  Time,
  MessageLinkPreview,
} from "./components";
import { ChatMessageContext, ChatMessageContextValue } from "./context";
import { getTextFromTextEditorString } from "./utils";
import styles from "./ChatMessage.module.scss";

interface ChatMessageProps {
  discussionMessage: DiscussionMessage;
  chatType: ChatType;
  highlighted?: boolean;
  className?: string;
  user: User | null;
  scrollToRepliedMessage: (messageId: string) => void;
  hasPermissionToHide: boolean;
  users: User[];
  feedItemId: string;
  commonMember: CommonMember | null;
  governanceCircles?: Circles;
  onMessageDelete?: (messageId: string) => void;
  directParent?: DirectParent | null;
  onUserClick?: (userId: string) => void;
  onStreamMentionClick?: ((feedItemId: string, options?: { commonId?: string; messageId?: string }) => void) | ((data: InternalLinkData) => void);
  onFeedItemClick?: (feedItemId: string) => void;
  onInternalLinkClick?: (data: InternalLinkData) => void;
  chatChannelId?: string;
}

export interface DMChatMessageReaction {
  emoji: string;
  prevUserEmoji?: string;
}

const getStaticLinkByChatType = (chatType: ChatType): StaticLinkType => {
  switch (chatType) {
    case ChatType.ProposalComments:
      return StaticLinkType.ProposalComment;
    default:
      return StaticLinkType.DiscussionMessage;
  }
};

const FILE_NAME_LIMIT = 20;

export default function DMChatMessage({
  discussionMessage,
  chatType,
  highlighted = false,
  className,
  user,
  scrollToRepliedMessage,
  hasPermissionToHide,
  users,
  feedItemId,
  commonMember,
  governanceCircles,
  onMessageDelete,
  directParent,
  onUserClick,
  onStreamMentionClick,
  onFeedItemClick,
  onInternalLinkClick,
  chatChannelId,
}: ChatMessageProps) {
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const { getCommonPagePath, getCommonPageAboutTabPath } = useRoutesContext();
  const updateMessageRef = useRef<{
    updateMessage: (message: TextEditorValue) => void;
    text: string;
  }>();
  const [isEditMode, setEditMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showReactWithEmoji, setShowReactWithEmoji] = useState(false);
  const [isMessageEditLoading, setIsMessageEditLoading] = useState(false);
  const [dmEmoji, setDMEmoji] = useState<DMChatMessageReaction | null>();
  const isTabletView = useIsTabletView();
  const isUserDiscussionMessage =
    checkIsUserDiscussionMessage(discussionMessage);
  const prevReactionCounts = usePrevious(
    isUserDiscussionMessage ? discussionMessage.reactionCounts : null,
  );
  const isSystemMessage = checkIsSystemDiscussionMessage(discussionMessage);
  const userId = user?.uid;
  const discussionMessageUserId = isUserDiscussionMessage
    ? discussionMessage.ownerId
    : null;
  const isNotCurrentUserMessage =
    !isUserDiscussionMessage || userId !== discussionMessageUserId;

  const [messageText, setMessageText] = useState<(string | JSX.Element)[]>([]);
  const [isMessageDataFetching, setIsMessageDataFetching] = useState(false);

  const [replyMessageText, setReplyMessageText] = useState<
    (string | JSX.Element)[]
  >([]);

  const createdAtDate = new Date(discussionMessage.createdAt.seconds * 1000);
  const editedAtDate = new Date(
    (discussionMessage.editedAt?.seconds ?? 0) * 1000,
  );

  const handleUserClick = () => {
    if (onUserClick && discussionMessageUserId) {
      onUserClick(discussionMessageUserId);
    }
  };

  useEffect(() => {
    (async () => {
      if (!discussionMessage.text) {
        setMessageText([]);
        return;
      }

      setIsMessageDataFetching(true);

      try {
        const parsedText = await getTextFromTextEditorString({
          userId,
          ownerId: discussionMessageUserId,
          textEditorString: discussionMessage.text,
          users,
          commonId: discussionMessage.commonId,
          systemMessage: isSystemMessage ? discussionMessage : undefined,
          getCommonPagePath,
          getCommonPageAboutTabPath,
          directParent,
          onUserClick,
          onStreamMentionClick,
          onFeedItemClick,
          onInternalLinkClick,
        });

        setMessageText(parsedText);
      } catch (error) {
        Logger.error(error);
      } finally {
        setIsMessageDataFetching(false);
      }
    })();
  }, [
    users,
    discussionMessage.text,
    isNotCurrentUserMessage,
    discussionMessage.commonId,
    isSystemMessage,
    getCommonPagePath,
    getCommonPageAboutTabPath,
    onUserClick,
    onStreamMentionClick,
  ]);

  useEffect(() => {
    (async () => {
      if (!discussionMessage?.parentMessage?.text) {
        return;
      }

      const parsedText = await getTextFromTextEditorString({
        userId,
        ownerId: discussionMessageUserId,
        textEditorString: discussionMessage?.parentMessage.text,
        users,
        commonId: discussionMessage.commonId,
        directParent,
        onUserClick,
        onStreamMentionClick,
        onFeedItemClick,
        onInternalLinkClick,
      });

      setReplyMessageText(parsedText);
    })();
  }, [
    users,
    discussionMessage?.parentMessage?.text,
    isNotCurrentUserMessage,
    discussionMessage.commonId,
    onUserClick,
    onStreamMentionClick,
    discussionMessageUserId,
    userId,
    onInternalLinkClick,
  ]);

  const handleLongPress = () => {
    setIsMenuOpen(true);
  };

  const getLongPressProps = useLongPress(
    isTabletView ? handleLongPress : null,
    {
      threshold: 400,
      cancelOnMovement: true,
    },
  );

  const handleContextMenu: MouseEventHandler<HTMLDivElement> = (event) => {
    if (!isTabletView) {
      event.preventDefault();
      setIsMenuOpen(true);
    }
  };

  const handleInternalLinkClick = useCallback(
    (data: InternalLinkData) => {
      const messageId = data.params[QueryParamKey.Message];

      if (
        data.params[QueryParamKey.Item] === feedItemId &&
        typeof messageId === "string"
      ) {
        scrollToRepliedMessage(messageId);
      } else {
        onInternalLinkClick?.(data);
      }
    },
    [feedItemId, scrollToRepliedMessage, onInternalLinkClick],
  );

  const ReplyMessage = useCallback(() => {
    if (
      !discussionMessage.parentMessage?.id ||
      (discussionMessage.parentMessage?.moderation?.flag ===
        ModerationFlags.Hidden &&
        !hasPermissionToHide)
    ) {
      return null;
    }

    const image = discussionMessage.parentMessage?.images?.[0]?.value;
    const file = discussionMessage.parentMessage?.files?.[0];

    return (
      <div
        onClick={() => {
          scrollToRepliedMessage(discussionMessage.parentMessage?.id as string);
        }}
        className={classNames(styles.replyMessageContainer, {
          [styles.replyMessageContainerCurrentUser]: !isNotCurrentUserMessage,
        })}
      >
        {image && <img className={styles.replyMessageImage} src={image} />}
        {file && (
          <FilePreview
            containerClassName={styles.fileContainer}
            name={file.title}
            src={file.value}
            isPreview
            size={24}
            variant={FilePreviewVariant.extraSmall}
          />
        )}
        <div className={styles.replyMessagesWrapper}>
          <div
            className={classNames(styles.messageName, styles.replyMessageName, {
              [styles.replyMessageNameWithImage]: image,
            })}
          >
            {userId === discussionMessage.parentMessage.ownerId
              ? "You"
              : discussionMessage.parentMessage?.ownerName}
          </div>
          <div
            className={classNames(
              styles.messageContent,
              styles.replyMessageContent,
              {
                [styles.replyMessageContentNotCurrentUser]:
                  isNotCurrentUserMessage,
                [styles.replyMessageContentWithImage]: image,
                [styles.replyMessageContentWithFile]: file,
                [styles.messageContentRtl]: isRtlWithNoMentions(
                  discussionMessage?.parentMessage?.text,
                ),
              },
            )}
          >
            {file ? (
              <>
                <p className={styles.fileTitle}>
                  {getFileName(file.title, FILE_NAME_LIMIT)}
                </p>
                {file.size && (
                  <p className={styles.fileSize}>{convertBytes(file.size)}</p>
                )}
              </>
            ) : (
              <ChatMessageLinkify>
                {replyMessageText.map((text) => text)}
              </ChatMessageLinkify>
            )}
          </div>
        </div>
      </div>
    );
  }, [
    discussionMessage.parentMessage,
    replyMessageText,
    hasPermissionToHide,
    isNotCurrentUserMessage,
    userId,
  ]);

  const filePreview = useMemo(
    () => discussionMessage.files?.[0],
    [discussionMessage.files],
  );

  const handleEditModeClose = () => {
    setEditMode(false);
  };

  const updateMessage = async (message: TextEditorValue) => {
    setIsMessageEditLoading(true);

    try {
      const updatedMessage = await ChatService.updateChatMessage({
        chatMessageId: discussionMessage.id,
        text: JSON.stringify(message),
        hasUncheckedItems: checkUncheckedItemsInTextEditorValue(message),
      });
      handleEditModeClose();
    } catch (err) {
      notify("Something went wrong");
    } finally {
      setIsMessageEditLoading(false);
    }
  };
  updateMessageRef.current = {
    updateMessage,
    text: discussionMessage.text,
  };

  const handleCheckboxChange = useCallback(
    (id: string, checked: boolean) => {
      if (!updateMessageRef.current) {
        return;
      }

      const textEditorValue = parseStringToTextEditorValue(
        updateMessageRef.current.text,
      );

      updateMessageRef.current.updateMessage(
        textEditorValue.map((value) =>
          Element.isElement(value) &&
          checkIsCheckboxItemElement(value) &&
          value.id === id
            ? { ...value, checked }
            : value,
        ),
      );
    },
    [updateMessageRef],
  );

  const chatMessageContextValue = useMemo<ChatMessageContextValue>(
    () => ({
      isMessageLoading: isMessageEditLoading,
      onCheckboxChange: handleCheckboxChange,
      isMessageEditAllowed: true,
    }),
    [isMessageEditLoading, handleCheckboxChange],
  );

  const emojiButton = (
    <ReactWithEmoji
      emojiButtonClassName={styles.emojiButton}
      chatMessageId={discussionMessage.id}
      chatChannelId={chatChannelId}
      className={
        isNotCurrentUserMessage
          ? styles.reactWithEmoji
          : styles.reactWithEmojiSelf
      }
      isNotCurrentUserMessage={isNotCurrentUserMessage}
      setDMEmoji={setDMEmoji}
    />
  );

  const finalReactionCounts = useMemo(() => {
    if (!isUserDiscussionMessage) return;
    if (!dmEmoji) {
      return discussionMessage.reactionCounts;
    }

    const reactions = discussionMessage.reactionCounts;

    if (!reactions) {
      return { [dmEmoji.emoji]: 1 };
    }

    if (!isEqual(prevReactionCounts, reactions)) {
      setDMEmoji(null);
      return discussionMessage.reactionCounts;
    }

    if (dmEmoji.prevUserEmoji === dmEmoji.emoji) {
      reactions[dmEmoji.emoji] -= 1;
    } else {
      if (reactions[dmEmoji.emoji]) {
        reactions[dmEmoji.emoji] += 1;
      } else {
        reactions[dmEmoji.emoji] = 1;
      }

      if (dmEmoji.prevUserEmoji) {
        reactions[dmEmoji.prevUserEmoji] -= 1;
      }
    }

    setDMEmoji(null);
    return reactions;
  }, [dmEmoji, discussionMessage]);

  return (
    <ChatMessageContext.Provider value={chatMessageContextValue}>
      <li
        id={discussionMessage.id}
        className={classNames(styles.container, className)}
        onMouseEnter={() => setShowReactWithEmoji(true)}
        onMouseLeave={() => setShowReactWithEmoji(false)}
      >
        <div
          className={classNames(styles.message, {
            [styles.messageCurrentUser]: !isNotCurrentUserMessage,
            [styles.systemMessageContainer]: isSystemMessage,
          })}
        >
          {!isSystemMessage && !isNotCurrentUserMessage && emojiButton}
          {isNotCurrentUserMessage && isUserDiscussionMessage && (
            <div className={styles.iconWrapper} onClick={handleUserClick}>
              <UserAvatar
                imageContainerClassName={styles.userAvatarContainer}
                photoURL={discussionMessage.owner?.photoURL}
                nameForRandomAvatar={discussionMessage.owner?.email}
                userName={getUserName(discussionMessage.owner)}
              />
            </div>
          )}
          {isEditMode ? (
            <EditMessageInput
              discussionMessage={discussionMessage}
              onClose={handleEditModeClose}
              commonMember={commonMember}
              isLoading={isMessageEditLoading}
              updateMessage={updateMessage}
            />
          ) : (
            <>
              <div
                onContextMenu={handleContextMenu}
                className={classNames(styles.messageText, {
                  [styles.messageTextCurrentUser]: !isNotCurrentUserMessage,
                  [styles.messageTextRtl]: isRtlWithNoMentions(
                    discussionMessage.text,
                  ),
                  [styles.messageTextWithReply]:
                    !!discussionMessage.parentMessage?.id,
                  [styles.systemMessage]: isSystemMessage,
                  [styles.highlighted]: highlighted && isNotCurrentUserMessage,
                  [styles.highlightedOwn]:
                    highlighted && !isNotCurrentUserMessage,
                  [styles.hasReactions]:
                    isUserDiscussionMessage &&
                    !isEmpty(discussionMessage.reactionCounts),
                })}
                {...getLongPressProps()}
              >
                {isNotCurrentUserMessage && !isSystemMessage && (
                  <div className={styles.messageName} onClick={handleUserClick}>
                    {getUserName(discussionMessage.owner)}
                  </div>
                )}
                <ReplyMessage />

                <div
                  className={classNames(styles.messageContent, {
                    [styles.messageContentCurrentUser]:
                      !isNotCurrentUserMessage,
                    [styles.messageContentRtl]:
                      !isSystemMessage &&
                      isRtlWithNoMentions(discussionMessage.text),
                  })}
                >
                  {filePreview && (
                    <FilePreview
                      src={filePreview.value}
                      name={filePreview.name || filePreview.title}
                      fileSize={filePreview.size}
                      variant={FilePreviewVariant.medium}
                      isCurrentUser={!isNotCurrentUserMessage}
                    />
                  )}
                  <ChatImageGallery gallery={discussionMessage.images ?? []} />
                  {discussionMessage.linkPreviews?.[0] && (
                    <MessageLinkPreview
                      linkPreview={discussionMessage.linkPreviews?.[0]}
                      isOtherPersonMessage={isNotCurrentUserMessage}
                    />
                  )}
                  <ChatMessageLinkify
                    onInternalLinkClick={handleInternalLinkClick}
                  >
                    {!messageText.length && isMessageDataFetching ? (
                      <i>Loading...</i>
                    ) : (
                      messageText.map((text) => text)
                    )}
                  </ChatMessageLinkify>
                  {!isSystemMessage && (
                    <Time
                      createdAtDate={createdAtDate}
                      editedAtDate={editedAtDate}
                      moderation={discussionMessage.moderation}
                      isNotCurrentUserMessage={isNotCurrentUserMessage}
                    />
                  )}
                </div>
                {!isSystemMessage && (
                  <ElementDropdown
                    commonMember={commonMember}
                    governanceCircles={governanceCircles}
                    linkType={getStaticLinkByChatType(chatType)}
                    entityType={
                      [
                        ChatType.DiscussionMessages,
                        ChatType.ChatMessages,
                      ].includes(chatType)
                        ? EntityTypes.DiscussionMessage
                        : EntityTypes.ProposalMessage
                    }
                    elem={discussionMessage}
                    className={styles.dropdownMenu}
                    variant={Orientation.Arrow}
                    onMenuToggle={setIsMenuOpen}
                    transparent
                    isDiscussionMessage
                    isChatMessage={chatType === ChatType.ChatMessages}
                    isDiscussionMessageWithFile={Boolean(filePreview)}
                    ownerId={
                      isUserDiscussionMessage
                        ? discussionMessage.ownerId
                        : undefined
                    }
                    userId={userId}
                    commonId={discussionMessage.commonId}
                    onEdit={() => setEditMode(true)}
                    isControlledDropdown={false}
                    isOpen={isMenuOpen}
                    styles={{
                      menu: styles.elementDropdownMenu,
                      menuButton: classNames(styles.menuArrowButton, {
                        [styles.menuArrowButtonVisible]: isMenuOpen,
                      }),
                    }}
                    feedItemId={feedItemId}
                    onDelete={onMessageDelete}
                  />
                )}

                {isUserDiscussionMessage && (
                  <Reactions
                    reactions={finalReactionCounts}
                    chatMessageId={discussionMessage.id}
                    chatChannelId={chatChannelId}
                    users={users}
                  />
                )}
              </div>
            </>
          )}
          {isNotCurrentUserMessage && emojiButton}
        </div>
      </li>
    </ChatMessageContext.Provider>
  );
}
