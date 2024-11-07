import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { FeedLayoutItemWithFollowData } from "@/shared/interfaces";
import { ChatChannel, CommonFeed, LastMessageContentWithMessageId } from "@/shared/models";
import { InboxActionType } from "./constants";
import { InboxItems, InboxSearchState } from "./types";

export const resetInbox = createStandardAction(InboxActionType.RESET_INBOX)<{
  onlyIfUnread?: boolean;
} | void>();

export const getInboxItems = createAsyncAction(
  InboxActionType.GET_INBOX_ITEMS,
  InboxActionType.GET_INBOX_ITEMS_SUCCESS,
  InboxActionType.GET_INBOX_ITEMS_FAILURE,
  InboxActionType.GET_INBOX_ITEMS_CANCEL,
)<
  {
    limit?: number;
    unread?: boolean;
    shouldUseLastStateIfExists?: boolean;
  },
  Omit<InboxItems, "loading" | "batchNumber">,
  Error,
  string
>();

export const addNewInboxItems = createStandardAction(
  InboxActionType.ADD_NEW_INBOX_ITEMS,
)<
  {
    item: FeedLayoutItemWithFollowData;
    statuses: {
      isAdded: boolean;
      isRemoved: boolean;
    };
  }[]
>();

export const updateInboxItem = createStandardAction(
  InboxActionType.UPDATE_INBOX_ITEM,
)<{
  item: FeedLayoutItemWithFollowData;
  isRemoved?: boolean;
}>();

export const updateFeedItem = createStandardAction(
  InboxActionType.UPDATE_FEED_ITEM,
)<{
  item: Partial<CommonFeed> & { id: string };
  isRemoved?: boolean;
}>();

export const updateChatChannelItem = createStandardAction(
  InboxActionType.UPDATE_CHAT_CHANNEL_ITEM,
)<{
  item: Partial<ChatChannel> & { id: string };
  isRemoved?: boolean;
}>();

export const updateChatChannelItemEmptiness = createStandardAction(
  InboxActionType.UPDATE_CHAT_CHANNEL_ITEM_EMPTINESS,
)<{
  id: string;
  becameEmpty: boolean;
}>();

export const resetInboxItems = createStandardAction(
  InboxActionType.RESET_INBOX_ITEMS,
)();

export const refetchInboxItems = createStandardAction(
  InboxActionType.REFETCH_INBOX_ITEMS,
)<boolean>();

export const searchInboxItems = createStandardAction(
  InboxActionType.SEARCH_INBOX_ITEMS,
)<string>();

export const setSearchState = createStandardAction(
  InboxActionType.SET_SEARCH_STATE,
)<InboxSearchState>();

export const resetSearchState = createStandardAction(
  InboxActionType.RESET_SEARCH_STATE,
)();

export const resetSearchInboxItems = createStandardAction(
  InboxActionType.RESET_SEARCH_INBOX_ITEMS,
)();

export const updateSearchInboxItems = createStandardAction(
  InboxActionType.UPDATE_SEARCH_INBOX_ITEMS,
)<string[]>();

export const setIsSearchingInboxItems = createStandardAction(
  InboxActionType.SET_IS_SEARCHING_INBOX_ITEMS,
)<boolean>();

export const setHasMoreInboxItems = createStandardAction(
  InboxActionType.SET_HAS_MORE_INBOX_ITEMS,
)<boolean>();

export const setSharedFeedItemId = createStandardAction(
  InboxActionType.SET_SHARED_FEED_ITEM_ID,
)<string | null>();

export const setSharedInboxItem = createStandardAction(
  InboxActionType.SET_SHARED_INBOX_ITEM,
)<FeedLayoutItemWithFollowData | null>();

export const addChatChannelItem = createStandardAction(
  InboxActionType.ADD_CHAT_CHANNEL_ITEM,
)<ChatChannel>();

export const removeEmptyChatChannelItems = createStandardAction(
  InboxActionType.REMOVE_EMPTY_CHAT_CHANNEL_ITEMS,
)<string | void>();

export const saveLastState = createStandardAction(
  InboxActionType.SAVE_LAST_STATE,
)<{ shouldSaveAsReadState: boolean }>();

export const setInboxItemUpdatedAt = createStandardAction(
  InboxActionType.SET_INBOX_ITEM_UPDATED_AT,
)<{ 
  feedItemId: string;
  lastMessage: LastMessageContentWithMessageId;
}>();
