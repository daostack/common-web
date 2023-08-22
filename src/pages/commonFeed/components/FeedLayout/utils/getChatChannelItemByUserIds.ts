import {
  ChatChannelLayoutItem,
  checkIsChatChannelLayoutItem,
  FeedLayoutItem,
} from "@/shared/interfaces";

export const getChatChannelItemByUserIds = (
  items: FeedLayoutItem[],
  currentUserId?: string,
  dmUserId?: string,
): ChatChannelLayoutItem | null => {
  if (!currentUserId || !dmUserId) {
    return null;
  }

  const isDMWithMyself = currentUserId === dmUserId;
  const item = items.find(
    (item): item is ChatChannelLayoutItem =>
      checkIsChatChannelLayoutItem(item) &&
      item.chatChannel.participants.includes(dmUserId) &&
      (!isDMWithMyself || item.chatChannel.participants.length === 1),
  );

  return item || null;
};
