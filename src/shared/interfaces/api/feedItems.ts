import { CommonFeed } from "@/shared/models";
import { SynchronizedDate } from "../SynchronizedDate";

export interface GetFeedItemsResponse {
  data: CommonFeed[];
  firstDocTimestamp: SynchronizedDate | null;
  lastDocTimestamp: SynchronizedDate | null;
  hasMore: boolean;
}
