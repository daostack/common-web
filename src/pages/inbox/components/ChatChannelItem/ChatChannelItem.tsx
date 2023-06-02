import React, { FC, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useChatContext } from "@/pages/common/components/ChatComponent";
import { UserAvatar } from "@/shared/components";
import { ChatChannelToDiscussionConverter } from "@/shared/converters";
import { useUserById } from "@/shared/hooks/useCases";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { ChatChannelFeedLayoutItemProps } from "@/shared/interfaces";
import { parseStringToTextEditorValue } from "@/shared/ui-kit";
import { getUserName } from "@/shared/utils";
import { FeedItemBaseContent } from "../FeedItemBaseContent";

export const ChatChannelItem: FC<ChatChannelFeedLayoutItemProps> = (props) => {
  const { chatChannel, isActive } = props;
  const isTabletView = useIsTabletView();
  const {
    fetchUser: fetchDMUser,
    data: dmUser,
    fetched: isDMUserFetched,
  } = useUserById();
  const { setChatItem, feedItemIdForAutoChatOpen } = useChatContext();
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const dmUserId = chatChannel.participants.filter(
    (participant) => participant !== userId,
  )[0];
  const dmUserName = getUserName(dmUser);
  const finalTitle = dmUserName;

  const handleOpenChat = useCallback(() => {
    setChatItem({
      feedItemId: chatChannel.id,
      discussion: ChatChannelToDiscussionConverter.toTargetEntity(chatChannel),
      chatChannel,
      circleVisibility: [],
      // lastSeenItem: chatChannel.lastSeen,
      // seenOnce: chatChannel.seenOnce,
    });
  }, [chatChannel]);

  const renderImage = (className?: string) => (
    <UserAvatar
      className={className}
      photoURL={dmUser?.photoURL}
      nameForRandomAvatar={dmUserName}
      userName={dmUserName}
    />
  );

  useEffect(() => {
    fetchDMUser(dmUserId);
  }, [dmUserId]);

  useEffect(() => {
    if (chatChannel.id === feedItemIdForAutoChatOpen) {
      handleOpenChat();
    }
  }, []);

  return (
    <FeedItemBaseContent
      lastActivity={chatChannel.updatedAt.seconds * 1000}
      unreadMessages={0}
      isMobileView={isTabletView}
      isActive={isActive}
      title={finalTitle}
      lastMessage={
        chatChannel.lastMessage?.text
          ? parseStringToTextEditorValue(chatChannel.lastMessage.text)
          : undefined
      }
      canBeExpanded={false}
      onClick={handleOpenChat}
      menuItems={[]}
      seenOnce={true}
      ownerId={userId}
      renderImage={renderImage}
      isImageRounded
    />
  );
};
