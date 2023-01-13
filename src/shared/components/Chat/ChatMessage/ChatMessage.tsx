import React, { useCallback, useState } from "react";
import classNames from "classnames";
import { Linkify, ElementDropdown, UserAvatar } from "@/shared/components";
import {
  DynamicLinkType,
  Orientation,
  ChatType,
  EntityTypes,
} from "@/shared/constants";
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
  const createdAtDate = new Date(discussionMessage.createdAt.seconds * 1000);
  const editedAtDate = new Date(discussionMessage.editedAt?.seconds * 1000);

  const isEdited = editedAtDate > createdAtDate;

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
    >
      <div className={styles.message}>
        <div className={styles.iconWrapper}>
          <UserAvatar
            photoURL={discussionMessage.owner?.photoURL}
            nameForRandomAvatar={discussionMessage.owner?.email}
            userName={getUserName(discussionMessage.owner)}
          />
        </div>
        {isEditMode ? (
          <EditMessageInput
            isProposalMessage={chatType === ChatType.ProposalComments}
            discussionMessage={discussionMessage}
            onClose={() => setEditMode(false)}
          />
        ) : (
          <div className={styles.messageText}>
            <ReplyMessage />
            <div className={styles.messageName}>
              {getUserName(discussionMessage.owner)}
            </div>
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
              onMenuToggle={onMessageDropdownOpen}
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
