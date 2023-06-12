import React, { FC, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useChatContext } from "@/pages/common/components/ChatComponent";
import { UserAvatar } from "@/shared/components";
import { LastSeenEntity } from "@/shared/constants";
import { ChatChannelToDiscussionConverter } from "@/shared/converters";
import { useChatChannelUserStatus, useUserById } from "@/shared/hooks/useCases";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { ChatChannelFeedLayoutItemProps } from "@/shared/interfaces";
import { ChatChannel } from "@/shared/models";
import { parseStringToTextEditorValue } from "@/shared/ui-kit";
import { getUserName } from "@/shared/utils";
import { inboxActions } from "@/store/states";
import { FeedItemBaseContent } from "../FeedItemBaseContent";
import { useChatChannelSubscription } from "./hooks";

export const ChatChannelItem: FC<ChatChannelFeedLayoutItemProps> = (props) => {
  const { chatChannel, isActive } = props;
  const dispatch = useDispatch();
  const isTabletView = useIsTabletView();
  const {
    fetchUser: fetchDMUser,
    data: dmUser,
    fetched: isDMUserFetched,
  } = useUserById();
  const {
    data: chatChannelUserStatus,
    fetched: isChatChannelUserStatusFetched,
    fetchChatChannelUserStatus,
  } = useChatChannelUserStatus();
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
      lastSeenItem: chatChannelUserStatus?.lastSeenChatMessageId
        ? {
            type: LastSeenEntity.DiscussionMessage,
            id: chatChannelUserStatus.lastSeenChatMessageId,
          }
        : undefined,
      seenOnce: chatChannelUserStatus?.seenOnce,
    });
  }, [
    chatChannel,
    chatChannelUserStatus?.lastSeenChatMessageId,
    chatChannelUserStatus?.seenOnce,
  ]);

  const handleChatChannelUpdate = useCallback(
    (item: ChatChannel, isRemoved: boolean) => {
      dispatch(
        inboxActions.updateChatChannelItem({
          item,
          isRemoved,
        }),
      );
    },
    [dispatch],
  );

  const renderImage = (className?: string) => (
    <UserAvatar
      className={className}
      photoURL={dmUser?.photoURL}
      nameForRandomAvatar={dmUserName}
      userName={dmUserName}
    />
  );

  useChatChannelSubscription(chatChannel.id, userId, handleChatChannelUpdate);

  useEffect(() => {
    fetchDMUser(dmUserId);
  }, [dmUserId]);

  useEffect(() => {
    fetchChatChannelUserStatus({
      userId: userId || "",
      chatChannelId: chatChannel.id,
    });
  }, [userId, chatChannel.id]);

  useEffect(() => {
    if (
      isChatChannelUserStatusFetched &&
      chatChannel.id === feedItemIdForAutoChatOpen
    ) {
      handleOpenChat();
    }
  }, [isChatChannelUserStatusFetched]);

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
