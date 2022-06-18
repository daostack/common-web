import React, { useState } from "react";
import classNames from "classnames";
import { Linkify, ElementDropdown } from "@/shared/components";
import {CommonMember, DiscussionMessage} from "@/shared/models";
import { getUserName, getUserInitials } from "@/shared/utils";
import { DynamicLinkType, Orientation, ChatType } from "@/shared/constants";
import {MODERATION_TYPES} from "@/containers/Common/interfaces";

interface ChatMessageProps {
  disscussionMessage: DiscussionMessage;
  chatType: ChatType;
  highlighted?: boolean;
  commonMember: CommonMember | null;
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
    commonMember,
  }: ChatMessageProps
) {
  const [imageError, setImageError] = useState(false);
  const mDate = new Date(disscussionMessage.createTime.seconds * 1000);

  return (
    <li
      id={disscussionMessage.id}
      className={classNames("message-wrapper", { highlighted })}
    >
      <div className="message">
        <div className="icon-wrapper">
          {disscussionMessage.owner?.photoURL && !imageError ? (
            <img
              src={disscussionMessage.owner?.photoURL}
              alt={getUserName(disscussionMessage.owner)}
              onError={() => setImageError(true)}
            />
          ) : (
            <span
              className="initials"
              style={{
                backgroundColor: Math.floor(Math.random() * 16777215).toString(
                  16
                ),
              }}
            >
              {getUserInitials(disscussionMessage.owner)}
            </span>
          )}
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
            elem={disscussionMessage}
            className="dropdown-menu"
            variant={Orientation.Horizontal}
            transparent
            commonMember={commonMember}
            elemType={MODERATION_TYPES.discussionMessage}
          />
        </div>
      </div>
    </li>
  );
}
