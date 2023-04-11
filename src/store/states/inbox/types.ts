import { FeedItemFollowWithMetadata, Timestamp } from "@/shared/models";

export interface InboxItems {
  data: FeedItemFollowWithMetadata[] | null;
  loading: boolean;
  hasMore: boolean;
  firstDocTimestamp: Timestamp | null;
  lastDocTimestamp: Timestamp | null;
}

export interface InboxState {
  items: InboxItems;
  sharedFeedItemId: string | null;
  sharedItem: FeedItemFollowWithMetadata | null;
}
