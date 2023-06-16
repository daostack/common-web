import React, { FC, ReactNode, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  ChatComponent,
  ChatItem,
} from "@/pages/common/components/ChatComponent";
import { checkHasAccessToChat } from "@/pages/common/components/CommonTabPanels/components";
import { useUserById } from "@/shared/hooks/useCases";
import { Circles, CirclesPermissions, CommonMember } from "@/shared/models";
import { getUserName, isRTL } from "@/shared/utils";
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
  const {
    fetchUser: fetchDMUser,
    setUser: setDMUser,
    data: dmUser,
  } = useUserById();
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const userCircleIds = useMemo(
    () => Object.values(commonMember?.circles.map ?? {}),
    [commonMember?.circles.map],
  );
  const dmUserId = chatItem.chatChannel?.participants.filter(
    (participant) => participant !== userId,
  )[0];
  const title = getUserName(dmUser) || chatItem.discussion.title;

  const hasAccessToChat = useMemo(
    () => checkHasAccessToChat(userCircleIds, chatItem),
    [chatItem, userCircleIds],
  );

  useEffect(() => {
    if (dmUserId) {
      fetchDMUser(dmUserId);
    } else {
      setDMUser(null);
    }
  }, [dmUserId]);

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.titleWrapper}>
        <p
          className={classNames(styles.title, {
            [styles.titleRTL]: isRTL(title),
          })}
          title={title}
        >
          {title}
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
