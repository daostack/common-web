import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { FeedLayoutItemWithFollowData } from "@/shared/interfaces";
import { ChatChannel, CommonFeed } from "@/shared/models";
import { InboxActionType } from "./constants";
import { InboxItems } from "./types";

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
  },
  Omit<InboxItems, "loading" | "batchNumber">,
  Error,
  string
>();

export const refreshUnreadInboxItems = createAsyncAction(
  InboxActionType.REFRESH_UNREAD_INBOX_ITEMS,
  InboxActionType.REFRESH_UNREAD_INBOX_ITEMS_SUCCESS,
  InboxActionType.REFRESH_UNREAD_INBOX_ITEMS_FAILURE,
  InboxActionType.REFRESH_UNREAD_INBOX_ITEMS_CANCEL,
)<{ newItemsAmount: number }, void, void, string>();

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
