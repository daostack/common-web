import {
  ChatChannelLayoutItem,
  checkIsChatChannelLayoutItem,
  FeedLayoutItem,
} from "@/shared/interfaces";

export const getDMChatChannelItemByUserIds = (
  items: FeedLayoutItem[],
  currentUserId?: string,
  dmUserId?: string,
): ChatChannelLayoutItem | null => {
  if (!currentUserId || !dmUserId) {
    return null;
  }

  const isDMWithMyself = currentUserId === dmUserId;
  const participantsAmount = isDMWithMyself ? 1 : 2;
  const item = items.find(
    (item): item is ChatChannelLayoutItem =>
      checkIsChatChannelLayoutItem(item) &&
      item.chatChannel.participants.includes(dmUserId) &&
      item.chatChannel.participants.length === participantsAmount,
  );

  return item || null;
};
