import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { InboxItemType } from "@/shared/constants";
import { MultipleSpacesLayoutActionType } from "./constants";
import {
  MultipleSpacesLayoutActiveChatChannelItem,
  MultipleSpacesLayoutActiveFeedItem,
  MultipleSpacesLayoutBreadcrumbs,
} from "./types";

export const resetMultipleSpacesLayout = createStandardAction(
  MultipleSpacesLayoutActionType.RESET,
)();

export const fetchBreadcrumbsData = createAsyncAction(
  MultipleSpacesLayoutActionType.FETCH_BREADCRUMBS_DATA,
  MultipleSpacesLayoutActionType.FETCH_BREADCRUMBS_DATA_SUCCESS,
  MultipleSpacesLayoutActionType.FETCH_BREADCRUMBS_DATA_FAILURE,
  MultipleSpacesLayoutActionType.FETCH_BREADCRUMBS_DATA_CANCEL,
)<
  {
    item?:
      | {
          type: InboxItemType.ChatChannel;
          activeItem: MultipleSpacesLayoutActiveChatChannelItem;
        }
      | {
          type: InboxItemType.FeedItemFollow;
          activeItem: MultipleSpacesLayoutActiveFeedItem;
        };
    commonId?: string;
  },
  void,
  Error,
  string
>();

export const setBreadcrumbsData = createStandardAction(
  MultipleSpacesLayoutActionType.SET_BREADCRUMBS_DATA,
)<MultipleSpacesLayoutBreadcrumbs | null>();
