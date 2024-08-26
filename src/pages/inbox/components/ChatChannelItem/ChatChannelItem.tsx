import React, { FC, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useChatContext } from "@/pages/common/components/ChatComponent";
import { UserAvatar } from "@/shared/components";
import { LastSeenEntity } from "@/shared/constants";
import { ChatChannelToDiscussionConverter } from "@/shared/converters";
import {
  useChatChannelUserStatus,
  useUpdateChatChannelSeenState,
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
  const { markChatChannelAsSeen, markChatChannelAsUnseen } =
    useUpdateChatChannelSeenState();
  const menuItems = useMenuItems(
    { chatChannelUserStatus },
    { markChatChannelAsSeen, markChatChannelAsUnseen },
  );
  const { setChatItem, feedItemIdForAutoChatOpen, shouldAllowChatAutoOpen } =
    useChatContext();
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const isGroupMessage = chatChannel.participants.length > 2;
  const dmUserIds = useMemo(
    () =>
      chatChannel.participants.length === 1
        ? chatChannel.participants
        : chatChannel.participants.filter(
            (participant) => participant !== userId,
          ),
    [chatChannel.participants],
  );

  const dmUsersNames = dmUsers?.map((user) => getUserName(user));
  const dmFirstNames = dmUsers?.map((user) => user.firstName);
  const finalTitle = joinWithLast(isGroupMessage ? dmFirstNames : dmUsersNames);
  const hoverTitle = isGroupMessage ? joinWithLast(dmUsersNames) : finalTitle;
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
      count: chatChannelUserStatus?.notSeenCount,
      seenOnce: chatChannelUserStatus?.seenOnce,
      seen: chatChannelUserStatus?.seen,
    });
  }, [
    chatChannel,
    chatChannelUserStatus?.lastSeenChatMessageId,
    chatChannelUserStatus?.notSeenCount,
    chatChannelUserStatus?.seenOnce,
    chatChannelUserStatus?.seen,
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
    isGroupMessage ? (
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
    fetchDMUsers(dmUserIds);
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
    if (isActive && shouldAllowChatAutoOpen !== null) {
      handleOpenChat();
    }
  }, [isActive, shouldAllowChatAutoOpen, handleOpenChat]);

  useEffect(() => {
    if (isActive && finalTitle && dmUsersNames) {
      onActiveItemDataChange?.({
        itemId: chatChannel.id,
        title: finalTitle,
        image: isGroupMessage ? "" : dmUsers?.[0]?.photoURL,
      });
    }
  }, [isActive, finalTitle, dmUsers?.[0]?.photoURL, dmUsersNames?.[0]]);

  const lastMessage = useMemo(() => getLastMessage(chatChannel.lastMessage), [chatChannel.lastMessage]);

  return (
    <FeedItemBaseContent
      lastActivity={chatChannel.updatedAt.seconds * 1000}
      unreadMessages={chatChannelUserStatus?.notSeenCount}
      isMobileView={isTabletView}
      isActive={isActive}
      title={finalTitle}
      lastMessage={lastMessage}
      canBeExpanded={false}
      onClick={handleOpenChat}
      menuItems={menuItems}
      seen={chatChannelUserStatus?.seen}
      seenOnce={chatChannelUserStatus?.seenOnce}
      ownerId={userId}
      renderImage={renderImage}
      isImageRounded
      dmUserIds={dmUserIds}
      isGroupMessage={isGroupMessage}
      createdBy={groupChatCreatorName}
      hoverTitle={hoverTitle}
    />
  );
};
