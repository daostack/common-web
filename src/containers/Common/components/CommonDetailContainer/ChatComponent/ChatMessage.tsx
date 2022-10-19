import React from "react";
import classNames from "classnames";
import { Linkify, ElementDropdown, UserAvatar } from "@/shared/components";
import { DiscussionMessage, User } from "@/shared/models";
import { getUserName } from "@/shared/utils";
import { DynamicLinkType, Orientation, ChatType, ENTITY_TYPES } from "@/shared/constants";

interface ChatMessageProps {
  disscussionMessage: DiscussionMessage;
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
    disscussionMessage,
    chatType,
    highlighted = false,
    className,
    onMessageDropdownOpen,
    user,
  }: ChatMessageProps
) {
  const mDate = new Date(disscussionMessage.createdAt.seconds * 1000);

  return (
    <li
      id={disscussionMessage.id}
      className={classNames("message-wrapper", className, { highlighted })}
    >
      <div className="message">
        <div className="icon-wrapper">
          <UserAvatar
            photoURL={disscussionMessage.owner?.photoURL}
            nameForRandomAvatar={disscussionMessage.owner?.email}
            userName={getUserName(disscussionMessage.owner)}
          />
        </div>
        <div className="message-text">
          <div className="message-name">
            {getUserName(disscussionMessage.owner)}
          </div>
          <div className="message-content">
            <Linkify>{disscussionMessage.text}</Linkify>
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
            elem={disscussionMessage}
            className="dropdown-menu"
            variant={Orientation.Horizontal}
            onMenuToggle={onMessageDropdownOpen}
            transparent
            isDiscussionMessage
            isOwner={user?.uid === disscussionMessage.owner?.id}
          />
        </div>
      </div>
    </li>
  );
}
