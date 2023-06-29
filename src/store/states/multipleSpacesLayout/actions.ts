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

export const fetchBreadcrumbsData = createAsyncAction(
  MultipleSpacesLayoutActionType.FETCH_BREADCRUMBS_DATA,
  MultipleSpacesLayoutActionType.FETCH_BREADCRUMBS_DATA_SUCCESS,
  MultipleSpacesLayoutActionType.FETCH_BREADCRUMBS_DATA_FAILURE,
  MultipleSpacesLayoutActionType.FETCH_BREADCRUMBS_DATA_CANCEL,
)<
  | {
      type: InboxItemType.ChatChannel;
      activeItem: MultipleSpacesLayoutActiveItem;
    }
  | {
      type: InboxItemType.FeedItemFollow;
      activeItem?: MultipleSpacesLayoutActiveItem;
      activeCommonId: string;
    },
  void,
  Error,
  string
>();

export const setBreadcrumbsData = createStandardAction(
  MultipleSpacesLayoutActionType.SET_BREADCRUMBS_DATA,
)<MultipleSpacesLayoutBreadcrumbs | null>();
