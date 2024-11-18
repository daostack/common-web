import {
  ChatChannelLayoutItem,
  FeedLayoutItemWithFollowData,
} from "@/shared/interfaces";
import { Timestamp } from "@/shared/models";

export interface InboxSearchState {
  isSearching: boolean;
  searchValue: string;
  items: FeedLayoutItemWithFollowData[] | null;
}

export interface InboxItems {
  data: FeedLayoutItemWithFollowData[] | null;
  loading: boolean;
  hasMore: boolean;
  firstDocTimestamp: Timestamp | null;
  lastDocTimestamp: Timestamp | null;
  batchNumber: number;
  unread: boolean;
}

export interface NewInboxItems {
  item: FeedLayoutItemWithFollowData;
  statuses: {
    isAdded: boolean;
    isRemoved: boolean;
  };
}

export type LastState = Pick<
  InboxState,
  | "items"
  | "sharedFeedItemId"
  | "sharedItem"
  | "chatChannelItems"
  | "nextChatChannelItemId"
>;

export interface InboxState {
  items: InboxItems;
  sharedFeedItemId: string | null;
  sharedItem: FeedLayoutItemWithFollowData | null;
  chatChannelItems: ChatChannelLayoutItem[];
  nextChatChannelItemId: string | null;
  searchState: InboxSearchState;
  lastReadState: LastState | null;
  lastUnreadState: LastState | null;
}

