import {
  ChatChannelLayoutItem,
  FeedLayoutItemWithFollowData,
} from "@/shared/interfaces";
import { Timestamp } from "@/shared/models";

export interface InboxItems {
  data: FeedLayoutItemWithFollowData[] | null;
  loading: boolean;
  hasMore: boolean;
  firstDocTimestamp: Timestamp | null;
  lastDocTimestamp: Timestamp | null;
}

export interface InboxState {
  items: InboxItems;
  sharedFeedItemId: string | null;
  sharedItem: FeedLayoutItemWithFollowData | null;
  chatChannelItems: ChatChannelLayoutItem[];
  nextChatChannelItemId: string | null;
}
