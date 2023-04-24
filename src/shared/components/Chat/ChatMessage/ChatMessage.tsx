import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import classNames from "classnames";
import { UserService } from "@/services";
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
import { ElementType } from "@/shared/ui-kit/TextEditor/constants";
import { ParagraphElement } from "@/shared/ui-kit/TextEditor/types";
import { parseTextEditorValueToString } from "@/shared/ui-kit/TextEditor/utils";
import { isRTL } from "@/shared/utils";
import { getUserName } from "@/shared/utils";
import { getModerationText } from "@/shared/utils/moderation";
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
  const [isEditMode, setEditMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isTabletView = useIsTabletView();
  const createdAtDate = new Date(discussionMessage.createdAt.seconds * 1000);
  const editedAtDate = new Date(
    (discussionMessage?.editedAt?.seconds ?? 0) * 1000,
  );

  const isNotCurrentUserMessage = user?.uid !== discussionMessage.ownerId;
  const isEdited = editedAtDate > createdAtDate;

  const [messageText, setMessageText] = useState<(string | JSX.Element)[]>([]);

  useEffect(() => {
    (async () => {
      const parsedText = await Promise.all(
        parseTextEditorValueToString(discussionMessage.text)?.map(
          async (tag) => {
            if (tag.type === ElementType.Mention) {
              const commonMember = commonMembers.find(
                ({ user }) => user.uid === tag.userId,
              );

              if (!commonMember) {
                const fetchedUser = await UserService.getUserById(tag.userId);
                return fetchedUser ? (
                  <span
                    className={styles.mentionText}
                  >{`@${fetchedUser.displayName} `}</span>
                ) : (
                  ""
                );
              }

              return (
                <span
                  className={styles.mentionText}
                >{`@${commonMember.user.displayName} `}</span>
              );
            }

            return (tag as ParagraphElement)?.text ?? "";
          },
        ),
      );

      setMessageText(parsedText);
    })();
  }, [commonMembers, discussionMessage.text]);

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

    return (
      <div
        onClick={() => {
          scrollToRepliedMessage(discussionMessage.parentMessage?.id as string);
        }}
        className={classNames(styles.replyMessageContainer, {
          [styles.replyMessageContainerCurrentUser]: !isNotCurrentUserMessage,
        })}
      >
        <div
          className={classNames(styles.messageName, styles.replyMessageName)}
        >
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
  }, [
    discussionMessage.parentMessage,
    hasPermissionToHide,
    isNotCurrentUserMessage,
  ]);

  parseTextEditorValueToString(discussionMessage.text);

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
              [styles.messageTextRtl]: isRTL(discussionMessage.text),
            })}
            onClick={handleMessageClick}
          >
            {isNotCurrentUserMessage && (
              <div className={styles.messageName}>
                {getUserName(discussionMessage.owner)}
              </div>
            )}
            <ReplyMessage />

            <div className={styles.messageContent}>
              <Linkify>{messageText.map((text) => text)}</Linkify>
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
