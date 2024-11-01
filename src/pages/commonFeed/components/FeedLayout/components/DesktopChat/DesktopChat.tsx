import React, { FC, ReactNode, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  ChatComponent,
  ChatItem,
} from "@/pages/common/components/ChatComponent";
import { checkHasAccessToChat } from "@/pages/common/components/CommonTabPanels/components";
import { UserAvatar } from "@/shared/components";
import { useUserById } from "@/shared/hooks/useCases";
import {
  Circles,
  CirclesPermissions,
  CommonMember,
  DirectParent,
} from "@/shared/models";
import { InternalLinkData } from "@/shared/utils";
import { getUserName, isRTL } from "@/shared/utils";
import { DesktopRightPane } from "../DesktopRightPane";
import { getChatType } from "./utils";
import styles from "./DesktopChat.module.scss";

interface ChatProps {
  className?: string;
  chatItem: ChatItem;
  commonId: string;
  governanceCircles?: Circles;
  commonMember: (CommonMember & CirclesPermissions) | null;
  withTitle?: boolean;
  titleRightContent?: ReactNode;
  onMessagesAmountChange?: (newMessagesAmount: number) => void;
  directParent?: DirectParent | null;
  renderChatInput?: () => ReactNode;
  onUserClick?: (userId: string) => void;
  onFeedItemClick?: (feedItemId: string) => void;
  onInternalLinkClick?: (data: InternalLinkData) => void;
}

const DesktopChat: FC<ChatProps> = (props) => {
  const {
    className,
    chatItem,
    commonId,
    governanceCircles,
    commonMember,
    withTitle = true,
    titleRightContent,
    onMessagesAmountChange,
    directParent,
    renderChatInput,
    onUserClick,
    onFeedItemClick,
    onInternalLinkClick,
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
  const title = getUserName(dmUser) || chatItem.discussion?.title || "";

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
    <DesktopRightPane
      className={classNames(className, {
        [styles.rightPaneContainerWithHeader]: withTitle,
      })}
    >
      {withTitle && (
        <div className={styles.titleWrapper}>
          {dmUser?.photoURL && (
            <UserAvatar
              className={styles.userAvatar}
              photoURL={dmUser.photoURL}
              nameForRandomAvatar={title}
              userName={title}
            />
          )}
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
      )}
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
        isHidden={false}
        count={chatItem.count}
        seenOnce={chatItem.seenOnce}
        seen={chatItem.seen}
        isAuthorized={Boolean(user)}
        onMessagesAmountChange={onMessagesAmountChange}
        directParent={directParent}
        renderChatInput={renderChatInput}
        onUserClick={onUserClick}
        onStreamMentionClick={onFeedItemClick}
        onFeedItemClick={onFeedItemClick}
        onInternalLinkClick={onInternalLinkClick}
      />
    </DesktopRightPane>
  );
};

export default DesktopChat;
