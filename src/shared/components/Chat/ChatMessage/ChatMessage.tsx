import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import classNames from "classnames";
import { Linkify, ElementDropdown, UserAvatar } from "@/shared/components";
import {
  DynamicLinkType,
  Orientation,
  ChatType,
  EntityTypes,
} from "@/shared/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { ModerationFlags } from "@/shared/interfaces/Moderation";
import {
  CommonMemberWithUserInfo,
  DiscussionMessage,
  User,
} from "@/shared/models";
import { ChatImageGallery } from "@/shared/ui-kit";
import { isRTL } from "@/shared/utils";
import { getUserName } from "@/shared/utils";
import { getModerationText } from "@/shared/utils/moderation";
import { EditMessageInput } from "../EditMessageInput";
import { getTextFromTextEditorString } from "./util";
import styles from "./ChatMessage.module.scss";

interface ChatMessageProps {
  discussionMessage: DiscussionMessage;
  chatType: ChatType;
  highlighted?: boolean;
  className?: string;
  onMessageDropdownOpen?: (isOpen: boolean) => void;
  user: User | null;
  scrollToRepliedMessage: (messageId: string) => void;
  hasPermissionToHide: boolean;
  commonMembers: CommonMemberWithUserInfo[];
}

const getDynamicLinkByChatType = (chatType: ChatType): DynamicLinkType => {
  switch (chatType) {
    case ChatType.DiscussionMessages:
      return DynamicLinkType.DiscussionMessage;
    case ChatType.ProposalComments:
      return DynamicLinkType.ProposalComment;
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
  commonMembers,
}: ChatMessageProps) {
  const messageRef = useRef<HTMLDivElement>(null);

  const [isEditMode, setEditMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isTabletView = useIsTabletView();
  const createdAtDate = new Date(discussionMessage.createdAt.seconds * 1000);
  const editedAtDate = new Date(
    (discussionMessage?.editedAt?.seconds ?? 0) * 1000,
  );

  const userId = user?.uid;
  const isNotCurrentUserMessage = userId !== discussionMessage.ownerId;
  const isEdited = editedAtDate > createdAtDate;

  const [messageText, setMessageText] = useState<(string | JSX.Element)[]>([]);
  const [replyMessageText, setReplyMessageText] = useState<
    (string | JSX.Element)[]
  >([]);

  useEffect(() => {
    (async () => {
      const parsedText = await getTextFromTextEditorString({
        textEditorString: discussionMessage.text,
        commonMembers,
        mentionTextClassName: !isNotCurrentUserMessage
          ? styles.mentionTextCurrentUser
          : "",
      });

      setMessageText(parsedText);
    })();
  }, [commonMembers, discussionMessage.text, isNotCurrentUserMessage]);

  useEffect(() => {
    (async () => {
      if (!discussionMessage?.parentMessage?.text) {
        return;
      }

      const parsedText = await getTextFromTextEditorString({
        textEditorString: discussionMessage?.parentMessage.text,
        commonMembers,
      });

      setReplyMessageText(parsedText);
    })();
  }, [
    commonMembers,
    discussionMessage?.parentMessage?.text,
    isNotCurrentUserMessage,
  ]);

  const handleMenuToggle = (isOpen: boolean) => {
    setIsMenuOpen(isOpen);

    if (onMessageDropdownOpen) {
      onMessageDropdownOpen(isOpen);
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

  return (
    <li
      id={discussionMessage.id}
      className={classNames(styles.container, className, { highlighted })}
      onContextMenu={handleContextMenu}
    >
      <div
        className={classNames(styles.message, {
          [styles.messageCurrentUser]: !isNotCurrentUserMessage,
        })}
      >
        {isNotCurrentUserMessage && (
          <div className={styles.iconWrapper}>
            <UserAvatar
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
          />
        ) : (
          <div
            ref={messageRef}
            className={classNames(styles.messageText, {
              [styles.messageTextCurrentUser]: !isNotCurrentUserMessage,
              [styles.messageTextRtl]: isRTL(discussionMessage.text),
              [styles.messageTextWithReply]:
                !!discussionMessage.parentMessage?.id,
            })}
            onClick={handleMessageClick}
          >
            {isNotCurrentUserMessage && (
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
              <ChatImageGallery gallery={discussionMessage.images ?? []} />
              <Linkify>{messageText.map((text) => text)}</Linkify>
              <div className={styles.timeWrapperContainer}>
                {isEdited && (
                  <div
                    className={classNames(
                      styles.timeWrapper,
                      styles.editedTimeWrapper,
                      {
                        [styles.timeWrapperCurrentUser]:
                          !isNotCurrentUserMessage,
                      },
                    )}
                  >
                    (Edited{" "}
                    {editedAtDate.toLocaleTimeString([], {
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    )
                  </div>
                )}
                <div
                  className={classNames(
                    styles.timeWrapper,
                    styles.creationTimeWrapper,
                    {
                      [styles.timeWrapperEdited]: isEdited,
                      [styles.timeWrapperCurrentUser]: !isNotCurrentUserMessage,
                    },
                  )}
                >
                  {createdAtDate.toLocaleTimeString([], {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  {discussionMessage?.moderation?.flag ===
                    ModerationFlags.Hidden &&
                    getModerationText(discussionMessage?.moderation?.flag)}
                </div>
              </div>
            </div>
            <ElementDropdown
              linkType={getDynamicLinkByChatType(chatType)}
              entityType={
                chatType === ChatType.DiscussionMessages
                  ? EntityTypes.DiscussionMessage
                  : EntityTypes.ProposalMessage
              }
              elem={discussionMessage}
              className={styles.dropdownMenu}
              variant={Orientation.Arrow}
              onMenuToggle={handleMenuToggle}
              transparent
              isDiscussionMessage
              ownerId={discussionMessage.owner?.uid}
              userId={userId}
              commonId={discussionMessage.commonId}
              onEdit={() => setEditMode(true)}
              isControlledDropdown={false}
              isOpen={isMenuOpen}
              styles={{
                menuButton: styles.menuArrowButton,
              }}
            />
          </div>
        )}
      </div>
    </li>
  );
}
