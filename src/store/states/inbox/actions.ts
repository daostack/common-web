import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { FeedLayoutItemWithFollowData } from "@/shared/interfaces";
import { ChatChannel, CommonFeed } from "@/shared/models";
import { InboxActionType } from "./constants";
import { InboxItems } from "./types";

export const resetInbox = createStandardAction(InboxActionType.RESET_INBOX)();

export const getInboxItems = createAsyncAction(
  InboxActionType.GET_INBOX_ITEMS,
  InboxActionType.GET_INBOX_ITEMS_SUCCESS,
  InboxActionType.GET_INBOX_ITEMS_FAILURE,
  InboxActionType.GET_INBOX_ITEMS_CANCEL,
)<
  {
    limit?: number;
  },
  Omit<InboxItems, "loading">,
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

export const resetInboxItems = createStandardAction(
  InboxActionType.RESET_INBOX_ITEMS,
)();

export const setSharedFeedItemId = createStandardAction(
  InboxActionType.SET_SHARED_FEED_ITEM_ID,
)<string | null>();

export const setSharedInboxItem = createStandardAction(
  InboxActionType.SET_SHARED_INBOX_ITEM,
)<FeedLayoutItemWithFollowData | null>();

export const setActiveChatChannelItem = createStandardAction(
  InboxActionType.SET_ACTIVE_CHAT_CHANNEL_ITEM,
)<ChatChannel | null>();
