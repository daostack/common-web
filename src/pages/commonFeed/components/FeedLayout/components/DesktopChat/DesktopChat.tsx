import React, { FC, ReactNode, useMemo } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  ChatComponent,
  ChatItem,
} from "@/pages/common/components/ChatComponent";
import { checkHasAccessToChat } from "@/pages/common/components/CommonTabPanels/components";
import { Circles, CirclesPermissions, CommonMember } from "@/shared/models";
import { isRTL } from "@/shared/utils";
import { getChatType } from "./utils";
import styles from "./DesktopChat.module.scss";

interface ChatProps {
  className?: string;
  chatItem: ChatItem;
  commonId: string;
  governanceCircles?: Circles;
  commonMember: (CommonMember & CirclesPermissions) | null;
  titleRightContent?: ReactNode;
  onMessagesAmountChange?: (newMessagesAmount: number) => void;
}

const DesktopChat: FC<ChatProps> = (props) => {
  const {
    className,
    chatItem,
    commonId,
    governanceCircles,
    commonMember,
    titleRightContent,
    onMessagesAmountChange,
  } = props;
  const user = useSelector(selectUser());
  const userCircleIds = useMemo(
    () => Object.values(commonMember?.circles.map ?? {}),
    [commonMember?.circles.map],
  );

  const hasAccessToChat = useMemo(
    () => checkHasAccessToChat(userCircleIds, chatItem),
    [chatItem, userCircleIds],
  );

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.titleWrapper}>
        <p
          className={classNames(styles.title, {
            [styles.titleRTL]: isRTL(chatItem.discussion.title),
          })}
          title={chatItem.discussion.title}
        >
          {chatItem.discussion.title}
        </p>
        {titleRightContent && (
          <div className={styles.titleRightContent}>{titleRightContent}</div>
        )}
      </div>
      <ChatComponent
        governanceCircles={governanceCircles}
        commonMember={commonMember}
        type={getChatType(chatItem)}
        isCommonMemberFetched
        commonId={commonId}
        discussion={chatItem.discussion}
        chatChannel={chatItem.chatChannel}
        feedItemId={chatItem.feedItemId}
        hasAccess={hasAccessToChat}
        lastSeenItem={chatItem.lastSeenItem}
        seenOnce={chatItem.seenOnce}
        isHidden={false}
        isAuthorized={Boolean(user)}
        onMessagesAmountChange={onMessagesAmountChange}
      />
    </div>
  );
};

export default DesktopChat;
