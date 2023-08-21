import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import classNames from "classnames";
import {
  Linkify,
  ElementDropdown,
  UserAvatar,
  UserInfoPopup,
} from "@/shared/components";
import { Orientation, ChatType, EntityTypes } from "@/shared/constants";
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
import { StaticLinkType, isRTL } from "@/shared/utils";
import { getUserName } from "@/shared/utils";
import { convertBytes } from "@/shared/utils/convertBytes";
import { EditMessageInput } from "../EditMessageInput";
import { Time } from "./components/Time";
import { getTextFromTextEditorString } from "./utils";
import styles from "./ChatMessage.module.scss";

interface ChatMessageProps {
  discussionMessage: DiscussionMessage;
  chatType: ChatType;
  highlighted?: boolean;
  className?: string;
  onMessageDropdownOpen?: (
    isOpen: boolean,
    messageTopPosition?: number,
  ) => void;
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
  onMessageDropdownOpen,
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
}: ChatMessageProps) {
  const messageRef = useRef<HTMLDivElement>(null);
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

  const handleMessageDropdownOpen =
    onMessageDropdownOpen &&
    ((isOpen: boolean) => {
      onMessageDropdownOpen(
        isOpen,
        messageRef.current?.getBoundingClientRect().top,
      );
    });

  useEffect(() => {
    (async () => {
      if (!discussionMessage.text) {
        setMessageText([]);
        return;
      }

      const emojiCount = countTextEditorEmojiElements(
        parseStringToTextEditorValue(discussionMessage.text),
      );
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
      });

      setMessageText(parsedText);
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

  const handleMenuToggle = (isOpen: boolean) => {
    setIsMenuOpen(isOpen);

    if (handleMessageDropdownOpen) {
      handleMessageDropdownOpen(isOpen);
    }
  };

  const handleMessageClick: MouseEventHandler<HTMLDivElement> = () => {
    if (isTabletView) {
      setIsMenuOpen(true);
    }
  };

  const handleContextMenu: MouseEventHandler<HTMLLIElement> = (event) => {
    if (!isTabletView) {
      event.preventDefault();
      setIsMenuOpen(true);
    }
  };

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
              <Linkify>{replyMessageText.map((text) => text)}</Linkify>
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
              ref={messageRef}
              className={classNames(styles.messageText, {
                [styles.messageTextCurrentUser]: !isNotCurrentUserMessage,
                [styles.messageTextRtl]: isRTL(discussionMessage.text),
                [styles.messageTextWithReply]:
                  !!discussionMessage.parentMessage?.id,
                [styles.systemMessage]: isSystemMessage,
                [styles.highlighted]: highlighted && isNotCurrentUserMessage,
                [styles.highlightedOwn]:
                  highlighted && !isNotCurrentUserMessage,
              })}
              onClick={handleMessageClick}
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
                <Linkify>{messageText.map((text) => text)}</Linkify>
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
                  onMenuToggle={handleMenuToggle}
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
                    menuButton: styles.menuArrowButton,
                  }}
                  feedItemId={feedItemId}
                  onDelete={onMessageDelete}
                />
              )}
            </div>
            {isSystemMessage && (
              <Time
                createdAtDate={createdAtDate}
                editedAtDate={editedAtDate}
                moderation={discussionMessage.moderation}
                isNotCurrentUserMessage={isNotCurrentUserMessage}
              />
            )}
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
