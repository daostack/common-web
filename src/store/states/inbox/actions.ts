import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { FeedItemFollowWithMetadata } from "@/shared/models";
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
    inboxItem: FeedItemFollowWithMetadata;
    statuses: {
      isAdded: boolean;
      isRemoved: boolean;
    };
  }[]
>();

export const updateInboxItem = createStandardAction(
  InboxActionType.UPDATE_INBOX_ITEM,
)<{
  item: Partial<FeedItemFollowWithMetadata> & { id: string };
  isRemoved?: boolean;
}>();

export const resetInboxItems = createStandardAction(
  InboxActionType.RESET_INBOX_ITEMS,
)();

export const setSharedInboxItemId = createStandardAction(
  InboxActionType.SET_SHARED_INBOX_ITEM_ID,
)<string | null>();

export const setSharedInboxItem = createStandardAction(
  InboxActionType.SET_SHARED_INBOX_ITEM,
)<FeedItemFollowWithMetadata | null>();
