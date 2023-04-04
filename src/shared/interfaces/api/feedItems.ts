import { CommonFeed } from "@/shared/models";
import { SynchronizedDate } from "../SynchronizedDate";

export interface GetFeedItemsResponse {
  data: {
    feedItems: CommonFeed[];
    pinnedFeedItems: CommonFeed[];
  };
  firstDocTimestamp: SynchronizedDate | null;
  lastDocTimestamp: SynchronizedDate | null;
  hasMore: boolean;
}
