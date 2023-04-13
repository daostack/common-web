import { CommonFeed, FeedItemFollowWithMetadata } from "@/shared/models";

export interface FeedLayoutRef {
  setExpandedFeedItemId: (feedItemId: string | null) => void;
}

export interface FeedLayoutItem {
  feedItem: CommonFeed;
  feedItemFollowWithMetadata?: FeedItemFollowWithMetadata;
}

export interface FeedLayoutItemWithFollowData
  extends Omit<FeedLayoutItem, "feedItemFollowWithMetadata"> {
  feedItemFollowWithMetadata: FeedItemFollowWithMetadata;
}
