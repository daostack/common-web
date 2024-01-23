import React, { FC, ReactNode, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
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
import { useUsersByIds } from "@/shared/hooks/useCases";
import {
  Circles,
  CirclesPermissions,
  CommonMember,
  DirectParent,
  PredefinedTypes,
} from "@/shared/models";
import { getUserName, joinWithLast } from "@/shared/utils";
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
  const { fetchUsers: fetchDMUsers, data: dmUsers } = useUsersByIds();
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const userCircleIds = useMemo(
    () => Object.values(commonMember?.circles.map ?? {}),
    [commonMember?.circles.map],
  );

  const chatParticipants = chatItem?.chatChannel?.participants;
  const isDM = chatParticipants && chatParticipants.length > 0;
  const isGroupMessage = chatParticipants && chatParticipants.length > 2;

  const dmUserIds = useMemo(
    () =>
      isDM
        ? chatParticipants.filter((participant) => participant !== userId)
        : [],
    [isDM, userId],
  );

  const dmUsersNames = dmUsers?.map((user) => getUserName(user));
  const dmFirstNames = dmUsers?.map((user) => user.firstName);
  const dmTitle = joinWithLast(isGroupMessage ? dmFirstNames : dmUsersNames);
  const title = isDM
    ? dmTitle
    : chatItem?.discussion?.predefinedType === PredefinedTypes.General
    ? commonName
    : chatItem?.discussion?.title;

  const hasAccessToChat = useMemo(
    () => checkHasAccessToChat(userCircleIds, chatItem),
    [chatItem, userCircleIds],
  );

  const handleOpenFeedItemDetails = () => {
    setIsShowFeedItemDetailsModal && setIsShowFeedItemDetailsModal(true);
  };

  useEffect(() => {
    if (isDM && dmUserIds.length > 0) {
      fetchDMUsers(dmUserIds);
    }
  }, [isDM, dmUserIds]);

  let height = window.visualViewport?.height;
  const viewport = window.visualViewport;
  window.visualViewport?.addEventListener("resize", resizeHandler);
  let isKeyboardOpen = false;

  function resizeHandler() {
    if (/iPhone|iPad|iPod/.test(window.navigator.userAgent)) {
      height = viewport?.height;
      console.log("iOS device");
      isKeyboardOpen = true;
    }

    //button.style.bottom = `${height - viewport.height + 10}px`;
  }

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
            title={title ?? ""}
            userAvatar={isDM && !isGroupMessage ? dmUsers?.[0]?.photoURL : ""}
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
          modalHeaderWrapper: classNames(styles.modalHeaderWrapper, {
            [styles.keyboardOpen]: isKeyboardOpen,
          }),
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
