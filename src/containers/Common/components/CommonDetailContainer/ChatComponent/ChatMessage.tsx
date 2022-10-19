import React, { useCallback, useState } from "react";
import classNames from "classnames";
import { Linkify, ElementDropdown, UserAvatar } from "@/shared/components";
import { DiscussionMessage, User } from "@/shared/models";
import { getUserName } from "@/shared/utils";
import { DynamicLinkType, Orientation, ChatType, ENTITY_TYPES } from "@/shared/constants";
import EditMessageInput from './EditMessageInput';

interface ChatMessageProps {
  discussionMessage: DiscussionMessage;
  chatType: ChatType;
  highlighted?: boolean;
  className?: string;
  onMessageDropdownOpen?: (isOpen: boolean) => void;
  user: User | null;
}

const getDynamicLinkByChatType = (chatType: ChatType): DynamicLinkType => {
  switch (chatType) {
    case ChatType.DiscussionMessages:
      return DynamicLinkType.DiscussionMessage;
    case ChatType.ProposalComments:
      return DynamicLinkType.ProposalComment;
  }
};

export default function ChatMessage(
  {
    discussionMessage,
    chatType,
    highlighted = false,
    className,
    onMessageDropdownOpen,
    user,
  }: ChatMessageProps
) {
  const [isEditMode, setEditMode] = useState(false);
  const [message, setMessage] = useState(discussionMessage.text);
  const mDate = new Date(discussionMessage.createdAt.seconds * 1000);

  const ReplyMessageContainer = useCallback(() => {
    if (!discussionMessage.parentMessage) {
      return null;
    }

    return (
      <div className="reply-message-container">
        <div className="message-name">
          {discussionMessage.parentMessage?.ownerName}
        </div>
        <Linkify>{discussionMessage.parentMessage.text}</Linkify>
      </div>
    )
  }, [discussionMessage.parentMessage])


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
         <EditMessageInput discussionMessage={discussionMessage} onClose={() => setEditMode(false)}/>
        ) : 
        (
          <div className="message-text">
            <ReplyMessageContainer />
            <div className="message-name">
              {getUserName(discussionMessage.owner)}
            </div>
            <div className="message-content">
              <Linkify>{discussionMessage.text}</Linkify>
              <div className="time-wrapper">
                {mDate.toLocaleTimeString([], {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <ElementDropdown
              linkType={getDynamicLinkByChatType(chatType)}
              entityType={ENTITY_TYPES.DiscussionMessage}
              elem={discussionMessage}
              className="dropdown-menu"
              variant={Orientation.Horizontal}
              onMenuToggle={onMessageDropdownOpen}
              transparent
              isDiscussionMessage
              isOwner={user?.uid === discussionMessage.owner?.id}
              onEdit={() => setEditMode(true)}
            />
          </div>
        )}
      </div>
    </li>
  );
}
