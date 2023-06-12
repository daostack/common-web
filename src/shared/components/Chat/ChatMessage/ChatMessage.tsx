import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import classNames from "classnames";
import { Linkify, ElementDropdown, UserAvatar } from "@/shared/components";
import { Orientation, ChatType, EntityTypes } from "@/shared/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { ModerationFlags } from "@/shared/interfaces/Moderation";
import {
  CommonMember,
  checkIsSystemDiscussionMessage,
  checkIsUserDiscussionMessage,
  DiscussionMessage,
  User,
} from "@/shared/models";
import { FilePreview, FilePreviewVariant } from "@/shared/ui-kit";
import { ChatImageGallery } from "@/shared/ui-kit";
import { StaticLinkType, isRTL } from "@/shared/utils";
import { getUserName } from "@/shared/utils";
import { EditMessageInput } from "../EditMessageInput";
import { Time } from "./components/Time";
import { getTextFromTextEditorString } from "./util";
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
  onMessageDelete?: (messageId: string) => void;
}

const getStaticLinkByChatType = (chatType: ChatType): StaticLinkType => {
  switch (chatType) {
    case ChatType.ProposalComments:
      return StaticLinkType.ProposalComment;
    default:
      return StaticLinkType.DiscussionMessage;
  }
};

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
  onMessageDelete,
}: ChatMessageProps) {
  const messageRef = useRef<HTMLDivElement>(null);
  const [isEditMode, setEditMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isTabletView = useIsTabletView();
  const isSystemMessage = checkIsSystemDiscussionMessage(discussionMessage);
  const userId = user?.uid;
  const isNotCurrentUserMessage =
    !checkIsUserDiscussionMessage(discussionMessage) ||
    userId !== discussionMessage.ownerId;

  const [messageText, setMessageText] = useState<(string | JSX.Element)[]>([]);

  const [replyMessageText, setReplyMessageText] = useState<
    (string | JSX.Element)[]
  >([]);

  const createdAtDate = new Date(discussionMessage.createdAt.seconds * 1000);
  const editedAtDate = new Date(
    (discussionMessage.editedAt?.seconds ?? 0) * 1000,
  );

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
      const parsedText = await getTextFromTextEditorString({
        textEditorString: discussionMessage.text,
        users,
        mentionTextClassName: !isNotCurrentUserMessage
          ? styles.mentionTextCurrentUser
          : "",
      });

      setMessageText(parsedText);
    })();
  }, [users, discussionMessage.text, isNotCurrentUserMessage]);

  useEffect(() => {
    (async () => {
      if (!discussionMessage?.parentMessage?.text) {
        return;
      }

      const parsedText = await getTextFromTextEditorString({
        textEditorString: discussionMessage?.parentMessage.text,
        users,
      });

      setReplyMessageText(parsedText);
    })();
  }, [users, discussionMessage?.parentMessage?.text, isNotCurrentUserMessage]);

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
              },
            )}
          >
            <Linkify>{replyMessageText.map((text) => text)}</Linkify>
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
      className={classNames(styles.container, className, { highlighted })}
      onContextMenu={handleContextMenu}
    >
      <div
        className={classNames(styles.message, {
          [styles.messageCurrentUser]: !isNotCurrentUserMessage,
          [styles.systemMessageContainer]: isSystemMessage,
        })}
      >
        {isNotCurrentUserMessage &&
          checkIsUserDiscussionMessage(discussionMessage) && (
            <div className={styles.iconWrapper}>
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
              })}
              onClick={handleMessageClick}
            >
              {isNotCurrentUserMessage && !isSystemMessage && (
                <div className={styles.messageName}>
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
                    name={filePreview.title}
                    size={128}
                    variant={FilePreviewVariant.medium}
                    iconContainerClassName={classNames({
                      [styles.iconContainerFilePreviewCurrentUser]:
                        !isNotCurrentUserMessage,
                    })}
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
                    checkIsUserDiscussionMessage(discussionMessage)
                      ? discussionMessage.owner?.uid
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
    </li>
  );
}
