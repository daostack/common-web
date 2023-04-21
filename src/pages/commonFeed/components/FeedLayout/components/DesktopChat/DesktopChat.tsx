import React, { FC, ReactNode, useMemo } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  ChatComponent,
  ChatItem,
} from "@/pages/common/components/ChatComponent";
import { checkHasAccessToChat } from "@/pages/common/components/CommonTabPanels/components";
import { ChatType } from "@/shared/constants";
import { Circles, CirclesPermissions, CommonMember } from "@/shared/models";
import { isRTL } from "@/shared/utils";
import styles from "./DesktopChat.module.scss";

interface ChatProps {
  className?: string;
  chatItem: ChatItem;
  commonId: string;
  governanceCircles?: Circles;
  commonMember: (CommonMember & CirclesPermissions) | null;
  titleRightContent?: ReactNode;
}

const DesktopChat: FC<ChatProps> = (props) => {
  const {
    className,
    chatItem,
    commonId,
    governanceCircles,
    commonMember,
    titleRightContent,
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
        type={
          chatItem.proposal
            ? ChatType.ProposalComments
            : ChatType.DiscussionMessages
        }
        isCommonMemberFetched
        commonId={commonId}
        discussion={chatItem.discussion}
        feedItemId={chatItem.feedItemId}
        hasAccess={hasAccessToChat}
        lastSeenItem={chatItem.lastSeenItem}
        isHidden={false}
        isAuthorized={Boolean(user)}
      />
    </div>
  );
};

export default DesktopChat;
