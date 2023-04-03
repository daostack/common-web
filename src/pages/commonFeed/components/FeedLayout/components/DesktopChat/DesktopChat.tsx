import React, { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  ChatComponent,
  ChatItem,
} from "@/pages/common/components/ChatComponentUpdated";
import { checkHasAccessToChat } from "@/pages/common/components/CommonTabPanels/components";
import { ChatType } from "@/shared/constants";
import { CirclesPermissions, Common, CommonMember } from "@/shared/models";
import { isRTL } from "@/shared/utils";
import styles from "./DesktopChat.module.scss";

interface ChatProps {
  className?: string;
  chatItem: ChatItem;
  common: Common;
  commonMember: (CommonMember & CirclesPermissions) | null;
}

const DesktopChat: FC<ChatProps> = (props) => {
  const { className, chatItem, common, commonMember } = props;
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
      </div>
      <ChatComponent
        commonMember={commonMember}
        type={
          chatItem.proposal
            ? ChatType.ProposalComments
            : ChatType.DiscussionMessages
        }
        common={common}
        discussion={chatItem.discussion}
        feedItemId={chatItem.feedItemId}
        hasAccess={hasAccessToChat}
        lastSeenItem={chatItem.lastSeenItem}
      />
    </div>
  );
};

export default DesktopChat;
