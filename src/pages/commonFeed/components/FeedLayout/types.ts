import { CommonFeed } from "@/shared/models";

export interface FeedLayoutRef {
  setExpandedFeedItemId: (feedItemId: string | null) => void;
}

export interface FeedLayoutItem {
  feedItem: CommonFeed;
}
