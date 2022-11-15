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
import EditMessageInput from "./EditMessageInput";

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
        className="reply-message-container"
      >
        <div className="message-name">
          {discussionMessage.parentMessage?.ownerName}
        </div>
        <div className="message-content reply-message-content">
          <Linkify>{discussionMessage.parentMessage.text}</Linkify>
        </div>
      </div>
    );
  }, [discussionMessage.parentMessage]);

  return (
    <li
      id={discussionMessage.id}
      className={classNames("message-wrapper", className, { highlighted })}
    >
      <div className="message">
        <div className="icon-wrapper">
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
          <div className="message-text">
            <ReplyMessage />
            <div className="message-name">
              {getUserName(discussionMessage.owner)}
            </div>
            <div className="message-content">
              <Linkify>{discussionMessage.text}</Linkify>
              <div className="time-wrapper-container">
                {isEdited && (
                  <div className="time-wrapper edited-time-wrapper ">
                    (Edited{" "}
                    {editedAtDate.toLocaleTimeString([], {
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    )
                  </div>
                )}
                <div className="time-wrapper creation-time-wrapper">
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
              className="dropdown-menu"
              variant={Orientation.Horizontal}
              onMenuToggle={onMessageDropdownOpen}
              transparent
              isDiscussionMessage
              isOwner={user?.uid === discussionMessage.owner?.id}
              userId={user?.uid}
              onEdit={() => setEditMode(true)}
            />
          </div>
        )}
      </div>
    </li>
  );
}
