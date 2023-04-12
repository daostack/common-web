import { FollowFeedItemAction } from "@/shared/constants";
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

export interface FollowFeedItemPayload {
  feedItemId: string;
  commonId: string;
  action: FollowFeedItemAction;
  emailSubscribed?: boolean;
  pushSubscribed?: boolean;
}
