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
import { ChatType } from "@/shared/constants";
import { useUsersByIds } from "@/shared/hooks/useCases";
import {
  ChatChannel,
  Circles,
  CirclesPermissions,
  CommonMember,
  DirectParent,
  PredefinedTypes,
} from "@/shared/models";
import { InternalLinkData } from "@/shared/utils";
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
  chatChannel?: ChatChannel;
  renderChatInput?: () => ReactNode;
  onClose: () => void;
  onUserClick?: (userId: string) => void;
  onStreamMentionClick?: ((feedItemId: string, options?: { commonId?: string; messageId?: string }) => void) | ((data: InternalLinkData) => void);
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
    chatChannel,
    renderChatInput,
    onClose,
    onUserClick,
    onFeedItemClick,
    onStreamMentionClick,
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

  const chatParticipants = (chatChannel || chatItem?.chatChannel)?.participants;
  const isDM = chatParticipants && chatParticipants.length > 0;
  const isGroupMessage = chatParticipants && chatParticipants.length > 2;

  const dmUserIds = useMemo(
    () =>
      isDM
        ? chatParticipants.filter((participant) => participant !== userId)
        : [],
    [isDM, userId, chatParticipants],
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
            count={chatItem.count}
            seenOnce={chatItem.seenOnce}
            seen={chatItem.seen}
            commonId={commonId}
            discussion={chatItem.discussion}
            chatChannel={chatItem.chatChannel}
            feedItemId={chatItem.feedItemId}
            lastSeenItem={chatItem.lastSeenItem}
            onMessagesAmountChange={onMessagesAmountChange}
            directParent={directParent}
            renderChatInput={renderChatInput}
            onUserClick={onUserClick}
            onStreamMentionClick={onStreamMentionClick}
            onFeedItemClick={onFeedItemClick}
            onInternalLinkClick={onInternalLinkClick}
          />
        )}
      </ChatMobileModal>
    </>
  );
};

export default MobileChat;
