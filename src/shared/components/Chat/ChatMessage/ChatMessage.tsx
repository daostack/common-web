import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
import classNames from "classnames";
import { useLongPress } from "use-long-press";
import { Logger } from "@/services";
import {
  ElementDropdown,
  UserAvatar,
  UserInfoPopup,
} from "@/shared/components";
import {
  Orientation,
  ChatType,
  EntityTypes,
  QueryParamKey,
} from "@/shared/constants";
import { Colors } from "@/shared/constants";
import { useRoutesContext } from "@/shared/contexts";
import { useModal } from "@/shared/hooks";
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
  countTextEditorEmojiElements,
  getFileName,
  parseStringToTextEditorValue,
} from "@/shared/ui-kit";
import { ChatImageGallery } from "@/shared/ui-kit";
import { StaticLinkType, isRtlText, getUserName } from "@/shared/utils";
import { convertBytes } from "@/shared/utils/convertBytes";
import { EditMessageInput } from "../EditMessageInput";
import { ChatMessageLinkify, InternalLinkData, Time } from "./components";
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
  onFeedItemClick?: (feedItemId: string) => void;
  onInternalLinkClick?: (data: InternalLinkData) => void;
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

export default function ChatMessage({
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
}: ChatMessageProps) {
  const { getCommonPagePath, getCommonPageAboutTabPath } = useRoutesContext();
  const [isEditMode, setEditMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isTabletView = useIsTabletView();
  const isUserDiscussionMessage =
    checkIsUserDiscussionMessage(discussionMessage);
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

  const {
    isShowing: isShowingUserProfile,
    onClose: onCloseUserProfile,
    onOpen: onOpenUserProfile,
  } = useModal(false);

  const handleUserClick = () => {
    if (onUserClick && discussionMessageUserId) {
      onUserClick(discussionMessageUserId);
    } else {
      onOpenUserProfile();
    }
  };

  useEffect(() => {
    (async () => {
      if (!discussionMessage.text) {
        setMessageText([]);
        return;
      }

      const emojiCount = countTextEditorEmojiElements(
        parseStringToTextEditorValue(discussionMessage.text),
      );

      setIsMessageDataFetching(true);

      try {
        const parsedText = await getTextFromTextEditorString({
          textEditorString: discussionMessage.text,
          users,
          mentionTextClassName: !isNotCurrentUserMessage
            ? styles.mentionTextCurrentUser
            : "",
          emojiTextClassName: classNames({
            [styles.singleEmojiText]: emojiCount.isSingleEmoji,
            [styles.multipleEmojiText]: emojiCount.isMultipleEmoji,
          }),
          commonId: discussionMessage.commonId,
          systemMessage: isSystemMessage ? discussionMessage : undefined,
          getCommonPagePath,
          getCommonPageAboutTabPath,
          directParent,
          onUserClick,
          onFeedItemClick,
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
  ]);

  useEffect(() => {
    (async () => {
      if (!discussionMessage?.parentMessage?.text) {
        return;
      }

      const parsedText = await getTextFromTextEditorString({
        textEditorString: discussionMessage?.parentMessage.text,
        users,
        commonId: discussionMessage.commonId,
        directParent,
        onUserClick,
        onFeedItemClick,
      });

      setReplyMessageText(parsedText);
    })();
  }, [
    users,
    discussionMessage?.parentMessage?.text,
    isNotCurrentUserMessage,
    discussionMessage.commonId,
    onUserClick,
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

  const handleContextMenu: MouseEventHandler<HTMLLIElement> = (event) => {
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
              [styles.replyMessageNameCurrentUser]: !isNotCurrentUserMessage,
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
                [styles.replyMessageContentCurrentUser]:
                  !isNotCurrentUserMessage,
                [styles.replyMessageContentWithImage]: image,
                [styles.replyMessageContentWithFile]: file,
                [styles.messageContentRtl]: isRtlText(
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

  return (
    <li
      id={discussionMessage.id}
      className={classNames(styles.container, className)}
      onContextMenu={handleContextMenu}
    >
      <div
        className={classNames(styles.message, {
          [styles.messageCurrentUser]: !isNotCurrentUserMessage,
          [styles.systemMessageContainer]: isSystemMessage,
        })}
      >
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
            isProposalMessage={chatType === ChatType.ProposalComments}
            isChatMessage={chatType === ChatType.ChatMessages}
            discussionMessage={discussionMessage}
            onClose={() => setEditMode(false)}
            commonMember={commonMember}
          />
        ) : (
          <>
            <div
              className={classNames(styles.messageText, {
                [styles.messageTextCurrentUser]: !isNotCurrentUserMessage,
                [styles.messageTextRtl]: isRtlText(discussionMessage.text),
                [styles.messageTextWithReply]:
                  !!discussionMessage.parentMessage?.id,
                [styles.systemMessage]: isSystemMessage,
                [styles.highlighted]: highlighted && isNotCurrentUserMessage,
                [styles.highlightedOwn]:
                  highlighted && !isNotCurrentUserMessage,
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
                  [styles.messageContentCurrentUser]: !isNotCurrentUserMessage,
                  [styles.messageContentRtl]:
                    !isSystemMessage && isRtlText(discussionMessage.text),
                })}
              >
                {filePreview && (
                  <FilePreview
                    src={filePreview.value}
                    name={filePreview.name || filePreview.title}
                    fileSize={filePreview.size}
                    variant={FilePreviewVariant.medium}
                    iconColor={
                      isNotCurrentUserMessage ? Colors.black : Colors.lightPink
                    }
                    isCurrentUser={!isNotCurrentUserMessage}
                  />
                )}
                <ChatImageGallery gallery={discussionMessage.images ?? []} />
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
            </div>
          </>
        )}
      </div>
      {isShowingUserProfile && isUserDiscussionMessage && (
        <UserInfoPopup
          commonId={discussionMessage.commonId}
          userId={discussionMessage.ownerId}
          avatar={discussionMessage.ownerAvatar}
          isShowing={isShowingUserProfile}
          onClose={onCloseUserProfile}
          directParent={directParent}
        />
      )}
    </li>
  );
}
