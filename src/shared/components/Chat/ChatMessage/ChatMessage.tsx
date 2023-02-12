import React, { MouseEventHandler, useCallback, useState } from "react";
import classNames from "classnames";
import { Linkify, ElementDropdown, UserAvatar } from "@/shared/components";
import {
  DynamicLinkType,
  Orientation,
  ChatType,
  EntityTypes,
} from "@/shared/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { DiscussionMessage, User } from "@/shared/models";
import { getUserName } from "@/shared/utils";
import { EditMessageInput } from "../EditMessageInput";
import styles from "./ChatMessage.module.scss";

interface ChatMessageProps {
  discussionMessage: DiscussionMessage;
  chatType: ChatType;
  highlighted?: boolean;
  className?: string;
  onMessageDropdownOpen?: (isOpen: boolean) => void;
  user: User | null;
  scrollToRepliedMessage: (messageId: string) => void;
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
}: ChatMessageProps) {
  const [isEditMode, setEditMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isTabletView = useIsTabletView();
  const createdAtDate = new Date(discussionMessage.createdAt.seconds * 1000);
  const editedAtDate = new Date(discussionMessage.editedAt?.seconds * 1000);

  const isNotCurrentUserMessage = user?.uid !== discussionMessage.ownerId;
  const isEdited = editedAtDate > createdAtDate;

  const handleMenuToggle = (isOpen: boolean) => {
    setIsMenuOpen(isOpen);

    if (onMessageDropdownOpen) {
      onMessageDropdownOpen(isOpen);
    }
  };

  const handleContextMenu: MouseEventHandler<HTMLLIElement> = (event) => {
    if (isTabletView) {
      return;
    }

    event.preventDefault();
    setIsMenuOpen(true);
  };

  const ReplyMessage = useCallback(() => {
    if (!discussionMessage.parentMessage?.id) {
      return null;
    }

    return (
      <div
        onClick={() => {
          scrollToRepliedMessage(discussionMessage.parentMessage?.id as string);
        }}
        className={styles.replyMessageContainer}
      >
        <div className={styles.messageName}>
          {discussionMessage.parentMessage?.ownerName}
        </div>
        <div
          className={classNames(
            styles.messageContent,
            styles.replyMessageContent,
          )}
        >
          <Linkify>{discussionMessage.parentMessage.text}</Linkify>
        </div>
      </div>
    );
  }, [discussionMessage.parentMessage]);

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
            className={classNames(styles.messageText, {
              [styles.messageTextCurrentUser]: !isNotCurrentUserMessage,
            })}
          >
            <ReplyMessage />
            {isNotCurrentUserMessage && (
              <div className={styles.messageName}>
                {getUserName(discussionMessage.owner)}
              </div>
            )}
            <div className={styles.messageContent}>
              <Linkify>{discussionMessage.text}</Linkify>
              <div className={styles.timeWrapperContainer}>
                {isEdited && (
                  <div
                    className={classNames(
                      styles.timeWrapper,
                      styles.editedTimeWrapper,
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
                    },
                  )}
                >
                  {createdAtDate.toLocaleTimeString([], {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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
              variant={Orientation.Horizontal}
              isOpen={isMenuOpen}
              onMenuToggle={handleMenuToggle}
              transparent
              isDiscussionMessage
              ownerId={discussionMessage.owner?.uid}
              userId={user?.uid}
              commonId={discussionMessage.commonId}
              onEdit={() => setEditMode(true)}
            />
          </div>
        )}
      </div>
    </li>
  );
}
