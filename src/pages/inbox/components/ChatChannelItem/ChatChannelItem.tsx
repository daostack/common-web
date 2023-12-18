import React, { FC, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useChatContext } from "@/pages/common/components/ChatComponent";
import { UserAvatar } from "@/shared/components";
import { LastSeenEntity } from "@/shared/constants";
import { ChatChannelToDiscussionConverter } from "@/shared/converters";
import {
  useChatChannelUserStatus,
  useUsersByIds,
} from "@/shared/hooks/useCases";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { GroupChatIcon } from "@/shared/icons";
import { ChatChannelFeedLayoutItemProps } from "@/shared/interfaces";
import { ChatChannel } from "@/shared/models";
import { getUserName, joinWithLast } from "@/shared/utils";
import { inboxActions } from "@/store/states";
import { FeedItemBaseContent } from "../FeedItemBaseContent";
import { useChatChannelSubscription, useMenuItems } from "./hooks";
import { getLastMessage } from "./utils";

export const ChatChannelItem: FC<ChatChannelFeedLayoutItemProps> = (props) => {
  const { chatChannel, isActive, onActiveItemDataChange } = props;
  const dispatch = useDispatch();
  const isTabletView = useIsTabletView();
  const { fetchUsers: fetchDMUsers, data: dmUsers } = useUsersByIds();
  const {
    data: chatChannelUserStatus,
    fetched: isChatChannelUserStatusFetched,
    fetchChatChannelUserStatus,
  } = useChatChannelUserStatus();
  const menuItems = useMenuItems({ chatChannelUserStatus });
  const { setChatItem, feedItemIdForAutoChatOpen, shouldAllowChatAutoOpen } =
    useChatContext();
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const groupMessage = chatChannel.participants.length > 2;
  const dmUserIds = useMemo(
    () =>
      chatChannel.participants.filter((participant) => participant !== userId),
    [],
  );

  const dmUsersNames = dmUsers?.map((user) => getUserName(user));
  const dmFirstNames = dmUsers?.map((user) => user.firstName);
  const finalTitle = joinWithLast(groupMessage ? dmFirstNames : dmUsersNames);
  const hoverTitle = groupMessage ? joinWithLast(dmUsersNames) : finalTitle;
  const groupChatCreatorName = getUserName(
    chatChannel.createdBy === user?.uid
      ? user
      : dmUsers?.find((user) => user.uid === chatChannel.createdBy),
  );

  const handleOpenChat = useCallback(() => {
    setChatItem({
      feedItemId: chatChannel.id,
      discussion: ChatChannelToDiscussionConverter.toTargetEntity(chatChannel),
      chatChannel,
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

  const renderImage = (className?: string) =>
    groupMessage ? (
      <GroupChatIcon className={className} />
    ) : (
      <UserAvatar
        className={className}
        photoURL={dmUsers?.[0]?.photoURL}
        nameForRandomAvatar={dmUsersNames?.[0]}
        userName={dmUsersNames?.[0]}
      />
    );

  useChatChannelSubscription(chatChannel.id, userId, handleChatChannelUpdate);

  useEffect(() => {
    fetchDMUsers(dmUserIds); // dm users not including the current user.
  }, [dmUserIds]);

  useEffect(() => {
    fetchChatChannelUserStatus({
      userId: userId || "",
      chatChannelId: chatChannel.id,
    });
  }, [userId, chatChannel.id]);

  useEffect(() => {
    if (
      isChatChannelUserStatusFetched &&
      chatChannel.id === feedItemIdForAutoChatOpen &&
      !isTabletView &&
      shouldAllowChatAutoOpen !== false
    ) {
      handleOpenChat();
    }
  }, [isChatChannelUserStatusFetched, shouldAllowChatAutoOpen]);

  useEffect(() => {
    if (isActive && finalTitle && dmUsersNames) {
      onActiveItemDataChange?.({
        itemId: chatChannel.id,
        title: dmUsersNames?.[0],
        image: dmUsers?.[0]?.photoURL,
      });
    }
  }, [isActive, finalTitle, dmUsers?.[0]?.photoURL, dmUsersNames?.[0]]);

  return (
    <FeedItemBaseContent
      lastActivity={chatChannel.updatedAt.seconds * 1000}
      unreadMessages={chatChannelUserStatus?.notSeenCount}
      isMobileView={isTabletView}
      isActive={isActive}
      title={finalTitle}
      lastMessage={getLastMessage(chatChannel.lastMessage)}
      canBeExpanded={false}
      onClick={handleOpenChat}
      menuItems={menuItems}
      seen={chatChannelUserStatus?.seen}
      seenOnce={chatChannelUserStatus?.seenOnce}
      ownerId={userId}
      renderImage={renderImage}
      isImageRounded
      dmUserIds={dmUserIds}
      groupMessage={groupMessage}
      createdBy={groupChatCreatorName}
      hoverTitle={hoverTitle}
    />
  );
};
