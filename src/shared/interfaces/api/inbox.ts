import { FeedItemFollowWithMetadata } from "@/shared/models";
import { SynchronizedDate } from "../SynchronizedDate";

export interface GetInboxResponse {
  inboxWithMetadata: FeedItemFollowWithMetadata[];
  inboxCounter?: number;
  firstDocTimestamp: SynchronizedDate | null;
  lastDocTimestamp: SynchronizedDate | null;
  count: number;
  hasMore: boolean;
}
