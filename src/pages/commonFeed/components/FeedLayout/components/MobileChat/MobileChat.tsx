import React, { FC, ReactNode, useMemo } from "react";
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
import { Circles, CirclesPermissions, CommonMember } from "@/shared/models";
import { Header } from "./components";
import styles from "./MobileChat.module.scss";

interface ChatProps {
  chatItem?: ChatItem | null;
  commonId: string;
  commonName: string;
  commonImage: string;
  governanceCircles?: Circles;
  commonMember: (CommonMember & CirclesPermissions) | null;
  shouldShowSeeMore?: boolean;
  rightHeaderContent?: ReactNode;
  onMessagesAmountChange?: (newMessagesAmount: number) => void;
}

const MobileChat: FC<ChatProps> = (props) => {
  const {
    chatItem,
    commonId,
    commonName,
    commonImage,
    governanceCircles,
    commonMember,
    children,
    shouldShowSeeMore = true,
    rightHeaderContent,
    onMessagesAmountChange,
  } = props;
  const { setChatItem, setIsShowFeedItemDetailsModal, setShouldShowSeeMore } =
    useChatContext();
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
    setShouldShowSeeMore && setShouldShowSeeMore(true);
  };

  const handleOpenFeedItemDetails = () => {
    setIsShowFeedItemDetailsModal && setIsShowFeedItemDetailsModal(true);
  };

  return (
    <>
      {children}
      <ChatMobileModal
        isShowing={Boolean(chatItem)}
        hasBackButton
        onClose={handleClose}
        commonName={commonName}
        commonImage={commonImage}
        header={
          <Header
            title={chatItem?.discussion.title || ""}
            onBackClick={handleClose}
            titleActionElement={
              shouldShowSeeMore ? (
                <span
                  onClick={handleOpenFeedItemDetails}
                  className={styles.headerActionElement}
                >
                  See more
                </span>
              ) : null
            }
            rightContent={rightHeaderContent}
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
            governanceCircles={governanceCircles}
            commonMember={commonMember}
            isCommonMemberFetched
            isAuthorized={Boolean(user)}
            type={
              chatItem.chatChannel
                ? ChatType.ChatMessages
                : ChatType.DiscussionMessages
            }
            hasAccess={hasAccessToChat}
            isHidden={false}
            commonId={commonId}
            discussion={chatItem.discussion}
            chatChannel={chatItem.chatChannel}
            feedItemId={chatItem.feedItemId}
            lastSeenItem={chatItem.lastSeenItem}
            seenOnce={chatItem.seenOnce}
            onMessagesAmountChange={onMessagesAmountChange}
          />
        )}
      </ChatMobileModal>
    </>
  );
};

export default MobileChat;
