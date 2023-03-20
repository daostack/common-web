import React, { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { ChatMobileModal } from "@/pages/common/components";
import {
  ChatComponent,
  ChatItem,
  useChatContext,
} from "@/pages/common/components/ChatComponent";
import { checkHasAccessToChat } from "@/pages/common/components/CommonTabPanels/components";
import { ChatType } from "@/shared/constants";
import { CirclesPermissions, Common, CommonMember } from "@/shared/models";
import { Header } from "./components";
import styles from "./MobileChat.module.scss";

interface ChatProps {
  chatItem?: ChatItem | null;
  common: Common;
  commonMember: (CommonMember & CirclesPermissions) | null;
}

const MobileChat: FC<ChatProps> = (props) => {
  const { chatItem, common, commonMember } = props;
  const { setChatItem } = useChatContext();
  const user = useSelector(selectUser());
  const userCircleIds = useMemo(
    () => Object.values(commonMember?.circles.map ?? {}),
    [commonMember?.circles.map],
  );

  const hasAccessToChat = useMemo(
    () => checkHasAccessToChat(userCircleIds, chatItem),
    [chatItem, userCircleIds],
  );

  const handleClose = () => {
    setChatItem(null);
  };

  return (
    <ChatMobileModal
      isShowing={Boolean(chatItem)}
      hasBackButton
      onClose={handleClose}
      common={common}
      header={
        <Header
          title={chatItem?.discussion.title || ""}
          onBackClick={handleClose}
        />
      }
      styles={{
        modal: styles.modal,
        modalHeaderWrapper: styles.modalHeaderWrapper,
        modalHeader: styles.modalHeader,
      }}
    >
      {chatItem && (
        <ChatComponent
          commonMember={commonMember}
          isCommonMemberFetched
          isAuthorized={Boolean(user)}
          type={ChatType.DiscussionMessages}
          hasAccess={hasAccessToChat}
          isHidden={false}
          common={common}
          discussion={chatItem.discussion}
          proposal={chatItem.proposal}
          feedItemId={chatItem.feedItemId}
          lastSeenItem={chatItem.lastSeenItem}
        />
      )}
    </ChatMobileModal>
  );
};

export default MobileChat;
