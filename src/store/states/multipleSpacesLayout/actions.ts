import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { InboxItemType } from "@/shared/constants";
import { MultipleSpacesLayoutActionType } from "./constants";
import {
  MultipleSpacesLayoutActiveItem,
  MultipleSpacesLayoutBreadcrumbs,
} from "./types";

export const resetMultipleSpacesLayout = createStandardAction(
  MultipleSpacesLayoutActionType.RESET,
)();

export const configureBreadcrumbsData = createStandardAction(
  MultipleSpacesLayoutActionType.CONFIGURE_BREADCRUMBS_DATA,
)<
  | {
      type: InboxItemType.ChatChannel;
      activeItem: MultipleSpacesLayoutActiveItem;
    }
  | {
      type: InboxItemType.FeedItemFollow;
      activeItem?: MultipleSpacesLayoutActiveItem;
      activeCommonId: string;
    }
>();

export const fetchBreadcrumbsItemsByCommonId = createAsyncAction(
  MultipleSpacesLayoutActionType.FETCH_BREADCRUMBS_ITEMS_BY_COMMON_ID,
  MultipleSpacesLayoutActionType.FETCH_BREADCRUMBS_ITEMS_BY_COMMON_ID_SUCCESS,
  MultipleSpacesLayoutActionType.FETCH_BREADCRUMBS_ITEMS_BY_COMMON_ID_FAILURE,
  MultipleSpacesLayoutActionType.FETCH_BREADCRUMBS_ITEMS_BY_COMMON_ID_CANCEL,
)<string | null, void, Error, string>();

export const setBreadcrumbsData = createStandardAction(
  MultipleSpacesLayoutActionType.SET_BREADCRUMBS_DATA,
)<MultipleSpacesLayoutBreadcrumbs | null>();
