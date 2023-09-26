import React, { FC, ReactNode, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { ChatMobileModal } from "@/pages/common/components";
import {
  ChatComponent,
  ChatItem,
  useChatContext,
} from "@/pages/common/components/ChatComponent";
import { checkHasAccessToChat } from "@/pages/common/components/CommonTabPanels/components";
import { InternalLinkData } from "@/shared/components";
import { ChatType } from "@/shared/constants";
import { useUserById } from "@/shared/hooks/useCases";
import {
  Circles,
  CirclesPermissions,
  CommonMember,
  DirectParent,
  PredefinedTypes,
} from "@/shared/models";
import { getUserName } from "@/shared/utils";
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
  directParent?: DirectParent | null;
  renderChatInput?: () => ReactNode;
  onClose: () => void;
  onUserClick?: (userId: string) => void;
  onFeedItemClick?: (feedItemId: string) => void;
  onInternalLinkClick?: (data: InternalLinkData) => void;
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
    directParent,
    renderChatInput,
    onClose,
    onUserClick,
    onFeedItemClick,
    onInternalLinkClick,
  } = props;
  const { setIsShowFeedItemDetailsModal } = useChatContext();
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
  const dmUserId = chatItem?.chatChannel?.participants.filter(
    (participant) => participant !== userId,
  )[0];
  const title =
    getUserName(dmUser) ||
    (chatItem?.discussion?.predefinedType === PredefinedTypes.General
      ? commonName
      : chatItem?.discussion?.title || "");

  const hasAccessToChat = useMemo(
    () => checkHasAccessToChat(userCircleIds, chatItem),
    [chatItem, userCircleIds],
  );

  const handleOpenFeedItemDetails = () => {
    setIsShowFeedItemDetailsModal && setIsShowFeedItemDetailsModal(true);
  };

  useEffect(() => {
    if (dmUserId) {
      fetchDMUser(dmUserId);
    } else {
      setDMUser(null);
    }
  }, [dmUserId]);

  return (
    <>
      {children}
      <ChatMobileModal
        isShowing={Boolean(chatItem)}
        hasBackButton
        onClose={onClose}
        commonName={commonName}
        commonImage={commonImage}
        header={
          <Header
            titleWrapperClassName={styles.headerTitleWrapper}
            title={title}
            userAvatar={dmUser?.photoURL}
            userName={title}
            onBackClick={onClose}
            onTitleWrapperClick={
              shouldShowSeeMore ? handleOpenFeedItemDetails : undefined
            }
            titleActionElement={
              shouldShowSeeMore ? (
                <span className={styles.headerActionElement}>
                  Tap to see more
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
            onMessagesAmountChange={onMessagesAmountChange}
            directParent={directParent}
            renderChatInput={renderChatInput}
            onUserClick={onUserClick}
            onFeedItemClick={onFeedItemClick}
            onInternalLinkClick={onInternalLinkClick}
          />
        )}
      </ChatMobileModal>
    </>
  );
};

export default MobileChat;
