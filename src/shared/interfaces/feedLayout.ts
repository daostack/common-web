import { ChatItem } from "@/pages/common/components/ChatComponent";
import { InboxItemType } from "@/shared/constants";
import {
  ChatChannel,
  CommonFeed,
  FeedItemFollowWithMetadata,
} from "@/shared/models";
import { convertObjectDatesToFirestoreTimestamps } from "@/shared/utils";

export interface FeedLayoutRef {
  setExpandedFeedItemId: (feedItemId: string | null) => void;
  setActiveItem: (item: ChatItem) => void;
  setShouldAllowChatAutoOpen: (shouldAllow: boolean | null) => void;
  getItemsContainerEl: () => Element | typeof window | null;
}

interface BaseLayoutItem {
  type: InboxItemType;
  itemId: string; // feed item id or chat channel id
}

export interface ChatChannelLayoutItem extends BaseLayoutItem {
  type: InboxItemType.ChatChannel;
  chatChannel: ChatChannel;
}

export interface FeedItemFollowLayoutItem extends BaseLayoutItem {
  type: InboxItemType.FeedItemFollow;
  feedItem: CommonFeed;
  feedItemFollowWithMetadata?: FeedItemFollowWithMetadata;
}

export interface FeedItemFollowLayoutItemWithFollowData
  extends Omit<FeedItemFollowLayoutItem, "feedItemFollowWithMetadata"> {
  feedItemFollowWithMetadata: FeedItemFollowWithMetadata;
}

export type FeedLayoutItem = FeedItemFollowLayoutItem | ChatChannelLayoutItem;
export type FeedLayoutItemWithFollowData =
  | FeedItemFollowLayoutItemWithFollowData
  | ChatChannelLayoutItem;

export const checkIsFeedItemFollowLayoutItem = (
  layoutItem?: BaseLayoutItem,
): layoutItem is FeedItemFollowLayoutItem =>
  layoutItem?.type === InboxItemType.FeedItemFollow;

export const checkIsFeedItemFollowLayoutItemWithFollowData = (
  layoutItem?: BaseLayoutItem,
): layoutItem is FeedItemFollowLayoutItemWithFollowData =>
  layoutItem?.type === InboxItemType.FeedItemFollow;

export const checkIsChatChannelLayoutItem = (
  layoutItem?: BaseLayoutItem | null,
): layoutItem is ChatChannelLayoutItem =>
  layoutItem?.type === InboxItemType.ChatChannel;

export interface FeedLayoutItemChangeData {
  itemId: string; // feed item id or chat channel id
  title: string;
  image?: string;
}

export type FeedLayoutItemChangeDataWithType = FeedLayoutItemChangeData &
  (
    | { type: InboxItemType.ChatChannel }
    | {
        type: InboxItemType.FeedItemFollow;
        commonId: string;
      }
  );

export const deserializeFeedItemFollowLayoutItem = <
  T extends FeedItemFollowLayoutItem | FeedItemFollowLayoutItemWithFollowData,
>(
  item: T,
): T => ({
  ...item,
  feedItem: convertObjectDatesToFirestoreTimestamps<CommonFeed>(item.feedItem),
  feedItemFollowWithMetadata: item.feedItemFollowWithMetadata && {
    ...convertObjectDatesToFirestoreTimestamps<FeedItemFollowWithMetadata>(
      item.feedItemFollowWithMetadata,
      ["lastSeen", "lastActivity"],
    ),
    feedItem: convertObjectDatesToFirestoreTimestamps<CommonFeed>(
      item.feedItemFollowWithMetadata.feedItem,
    ),
  },
});

export const deserializeChatChannelLayoutItem = (
  item: ChatChannelLayoutItem,
): ChatChannelLayoutItem => ({
  ...item,
  chatChannel: convertObjectDatesToFirestoreTimestamps<ChatChannel>(
    item.chatChannel,
    ["lastMessage.createdAt"],
  ),
});

export const deserializeFeedLayoutItem = (
  item: FeedLayoutItem,
): FeedLayoutItem =>
  checkIsChatChannelLayoutItem(item)
    ? deserializeChatChannelLayoutItem(item)
    : deserializeFeedItemFollowLayoutItem(item);

export const deserializeFeedLayoutItemWithFollowData = (
  item: FeedLayoutItemWithFollowData,
): FeedLayoutItemWithFollowData =>
  checkIsChatChannelLayoutItem(item)
    ? deserializeChatChannelLayoutItem(item)
    : deserializeFeedItemFollowLayoutItem(item);
