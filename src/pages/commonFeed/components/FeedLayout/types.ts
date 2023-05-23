import { InboxItemType } from "@/shared/constants";
import {
  ChatChannel,
  CommonFeed,
  FeedItemFollowWithMetadata,
} from "@/shared/models";

export interface FeedLayoutRef {
  setExpandedFeedItemId: (feedItemId: string | null) => void;
}

interface BaseLayoutItem {
  type?: InboxItemType;
  itemId: string;
}

interface ChatChannelLayoutItem extends BaseLayoutItem {
  type: InboxItemType.ChatChannel;
  chatChannel: ChatChannel;
}

interface FeedItemFollowLayoutItem extends BaseLayoutItem {
  type?: InboxItemType.FeedItemFollow;
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
