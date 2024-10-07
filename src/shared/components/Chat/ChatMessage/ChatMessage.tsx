import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { isEmpty } from "lodash";
import { Element } from "slate";
import { useLongPress } from "use-long-press";
import * as oldCommonActions from "@/pages/OldCommon/store/actions";
import { ChatService, DiscussionMessageService } from "@/services";
import botAvatarSrc from "@/shared/assets/images/bot-avatar.svg";
import { ElementDropdown, UserAvatar } from "@/shared/components";
import {
  Orientation,
  ChatType,
  EntityTypes,
  QueryParamKey,
} from "@/shared/constants";
import { useNotification } from "@/shared/hooks";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { ModerationFlags } from "@/shared/interfaces/Moderation";
import {
  CommonMember,
  checkIsSystemDiscussionMessage,
  checkIsUserDiscussionMessage,
  User,
  DirectParent,
  Circles,
  DiscussionMessageWithParsedText,
  ParentDiscussionMessage,
  checkIsBotDiscussionMessage,
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
  discussionMessage: DiscussionMessageWithParsedText;
  chatType: ChatType;
  highlighted?: boolean;
  className?: string;
  user: User | null;
  scrollToRepliedMessage: (messageId: string, messageDate: Date) => void;
  hasPermissionToHide: boolean;
  users: User[];
  feedItemId: string;
  commonMember: CommonMember | null;
  governanceCircles?: Circles;
  onMessageDelete?: (messageId: string) => void;
  directParent?: DirectParent | null;
  onUserClick?: (userId: string) => void;
  onFeedItemClick?: (feedItemId: string) => void;
  onInternalLinkClick?: (data: InternalLinkData) => void;
  isMessageEditAllowed: boolean;
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

const ChatMessage = ({
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
  onFeedItemClick,
  onInternalLinkClick,
  isMessageEditAllowed,
}: ChatMessageProps) => {
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const updateMessageRef = useRef<{
    updateMessage: (message: TextEditorValue) => void;
    text: string;
  }>();
  const [isEditMode, setEditMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [parsedMessage, setParsedMessage] = useState(discussionMessage.parsedText);
  const [isMessageEditLoading, setIsMessageEditLoading] = useState(false);
  const isTabletView = useIsTabletView();
  const isUserDiscussionMessage =
    checkIsUserDiscussionMessage(discussionMessage);
  const isSystemMessage = checkIsSystemDiscussionMessage(discussionMessage);
  const isBotMessage = checkIsBotDiscussionMessage(discussionMessage);
  const userId = user?.uid;
  const discussionMessageUserId = isUserDiscussionMessage
    ? discussionMessage.ownerId
    : null;
  const isNotCurrentUserMessage =
    !isUserDiscussionMessage || userId !== discussionMessageUserId;
  const initialEditedAtDate = new Date(
    (discussionMessage.editedAt?.seconds ?? 0) * 1000,
  );

  const [replyMessageText, setReplyMessageText] = useState<
    (string | JSX.Element)[]
  >([]);

  const [parentMessage, setParentMessage] = useState<ParentDiscussionMessage>();

  useEffect(() => {
    (async () => {
      if (!discussionMessage?.parentId) {
        return;
      }

      const parentMessage =
        discussionMessage?.parentMessage ||
        (await DiscussionMessageService.getDiscussionMessageById(
          discussionMessage?.parentId,
        ));

      const parsedText = await getTextFromTextEditorString({
        userId,
        ownerId: discussionMessageUserId,
        textEditorString: parentMessage?.text,
        users,
        commonId: discussionMessage.commonId,
        directParent,
        onUserClick,
        onFeedItemClick,
        onInternalLinkClick,
      });

      setReplyMessageText(parsedText);
      setParentMessage(parentMessage);
    })();
  }, [
    users,
    discussionMessage?.parentMessage?.text,
    isNotCurrentUserMessage,
    discussionMessage.commonId,
    onUserClick,
    onInternalLinkClick,
  ]);

  const createdAtDate = new Date(discussionMessage.createdAt.seconds * 1000);
  const [editedAtDate, setEditedAtDate] = useState(initialEditedAtDate);

  const handleUserClick = () => {
    if (onUserClick && discussionMessageUserId && !isBotMessage) {
      onUserClick(discussionMessageUserId);
    }
  };

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
        parentMessage &&
          scrollToRepliedMessage(messageId, parentMessage.createdAt.toDate());
      } else {
        onInternalLinkClick?.(data);
      }
    },
    [feedItemId, scrollToRepliedMessage, onInternalLinkClick],
  );

  const scrollToReplied = (): void => {
    if (parentMessage) {
      scrollToRepliedMessage(
        parentMessage?.id as string,
        parentMessage.createdAt.toDate(),
      );
    }
  };

  const handleEditModeClose = () => {
    setEditMode(false);
  };

  const updateDiscussionMessage = (message: TextEditorValue) => {
    if (!checkIsUserDiscussionMessage(discussionMessage)) {
      notify("Something went wrong");
      return;
    }
    setIsMessageEditLoading(true);
    dispatch(
      oldCommonActions.updateDiscussionMessage.request({
        payload: {
          discussionMessageId: discussionMessage.id,
          ownerId: discussionMessage.ownerId,
          text: JSON.stringify(message),
          hasUncheckedItems: checkUncheckedItemsInTextEditorValue(message),
        },
        isProposalMessage: chatType === ChatType.ProposalComments,
        discussionId: discussionMessage.discussionId,
        callback(isSucceed) {
          setIsMessageEditLoading(false);
          if (isSucceed) {
            handleEditModeClose();
          } else {
            notify("Something went wrong");
            setParsedMessage(discussionMessage.parsedText);
            setEditedAtDate(initialEditedAtDate);
          }
        },
      }),
    );
  };

  const updateChatMessage = async (message: TextEditorValue) => {
    setIsMessageEditLoading(true);

    try {
      await ChatService.updateChatMessage({
        chatMessageId: discussionMessage.id,
        text: JSON.stringify(message),
        hasUncheckedItems: checkUncheckedItemsInTextEditorValue(message),
      });
      handleEditModeClose();
    } catch (err) {
      notify("Something went wrong");
      setParsedMessage(discussionMessage.parsedText);
      setEditedAtDate(initialEditedAtDate);
    } finally {
      setIsMessageEditLoading(false);
    }
  };

  const updateMessage = async (message: TextEditorValue) => {
    try {
    if (chatType === ChatType.ChatMessages) {
      updateChatMessage(message);
    } else {
      updateDiscussionMessage(message);
    }
    const parsedText = await getTextFromTextEditorString({
      userId,
      ownerId: discussionMessageUserId,
      textEditorString: JSON.stringify(message),
      users,
      commonId: discussionMessage.commonId,
      directParent,
      onUserClick,
      onFeedItemClick,
      onInternalLinkClick,
    });

    setParsedMessage(parsedText);
    setEditedAtDate(new Date());
    handleEditModeClose();
  } catch(err) {
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

  const ReplyMessage = useCallback(() => {
    if (
      !parentMessage?.id ||
      (parentMessage?.moderation?.flag === ModerationFlags.Hidden &&
        !hasPermissionToHide)
    ) {
      return null;
    }

    const image = parentMessage?.images?.[0]?.value;
    const file = parentMessage?.files?.[0];

    return (
      <div
        onClick={scrollToReplied}
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
            {userId === parentMessage.ownerId
              ? "You"
              : parentMessage?.ownerName}
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
                  parentMessage?.text,
                ),
              },
            )}
          >
            {file ? (
              <>
                <p className={styles.fileTitle}>
                  {getFileName(file.name ?? file.title, FILE_NAME_LIMIT)}
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
  }, [parentMessage, hasPermissionToHide, isNotCurrentUserMessage, userId]);

  const filePreview = useMemo(
    () => discussionMessage.files?.[0],
    [discussionMessage.files],
  );

  const chatMessageContextValue = useMemo<ChatMessageContextValue>(
    () => ({
      isMessageLoading: isMessageEditLoading,
      onCheckboxChange: handleCheckboxChange,
      isMessageEditAllowed,
    }),
    [isMessageEditLoading, handleCheckboxChange, isMessageEditAllowed],
  );

  const EmojiButton = useCallback(() => {
    return (
      <ReactWithEmoji
        emojiButtonClassName={styles.emojiButton}
        discussionId={discussionMessage.discussionId}
        discussionMessageId={discussionMessage.id}
        className={
          isNotCurrentUserMessage
            ? styles.reactWithEmoji
            : styles.reactWithEmojiSelf
        }
        isNotCurrentUserMessage={isNotCurrentUserMessage}
      />
    );
  }, [
    discussionMessage.discussionId,
    discussionMessage.id,
    isNotCurrentUserMessage,
  ]);

  if (isSystemMessage && discussionMessage.parsedText.length === 0) {
    return null;
  }

  return (
    <ChatMessageContext.Provider value={chatMessageContextValue}>
      <li
        id={discussionMessage.id}
        className={classNames(styles.container, className)}
      >
        <div
          className={classNames(styles.message, {
            [styles.messageCurrentUser]: !isNotCurrentUserMessage,
            [styles.systemMessageContainer]: isSystemMessage,
          })}
        >
          {!isSystemMessage && !isNotCurrentUserMessage && <EmojiButton />}
          {isNotCurrentUserMessage &&
            (isUserDiscussionMessage || isBotMessage) && (
              <div className={styles.iconWrapper} onClick={handleUserClick}>
                <UserAvatar
                  imageContainerClassName={styles.userAvatarContainer}
                  photoURL={
                    isBotMessage
                      ? botAvatarSrc
                      : discussionMessage.owner?.photoURL
                  }
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
                  [styles.messageTextWithReply]: !!parentMessage?.id,
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
                    {isBotMessage ? "AI" : getUserName(discussionMessage.owner)}
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
                    {(parsedMessage ?? []).map((text) => text)}
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

                {!isSystemMessage && isUserDiscussionMessage && (
                  <Reactions
                    reactions={discussionMessage.reactionCounts}
                    discussionMessageId={discussionMessage.id}
                    users={users}
                  />
                )}
              </div>
            </>
          )}
          {!isSystemMessage && isNotCurrentUserMessage && <EmojiButton />}
        </div>
      </li>
    </ChatMessageContext.Provider>
  );
};

const MemoizedChatMessage = React.memo(ChatMessage);

export default MemoizedChatMessage;
