import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { InboxItemType } from "@/shared/constants";
import { MultipleSpacesLayoutActionType } from "./constants";
import {
  MultipleSpacesLayoutActiveItem,
  MultipleSpacesLayoutBreadcrumbs,
  ProjectsStateItem,
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

export const moveBreadcrumbsToPrevious = createStandardAction(
  MultipleSpacesLayoutActionType.MOVE_BREADCRUMBS_TO_PREVIOUS,
)();

export const addOrUpdateProjectInBreadcrumbs = createStandardAction(
  MultipleSpacesLayoutActionType.ADD_OR_UPDATE_PROJECT_IN_BREADCRUMBS,
)<ProjectsStateItem>();

export const updateProjectInBreadcrumbs = createStandardAction(
  MultipleSpacesLayoutActionType.UPDATE_PROJECT_IN_BREADCRUMBS,
)<{ commonId: string } & Partial<Omit<ProjectsStateItem, "commonId">>>();

export const setBackUrl = createStandardAction(
  MultipleSpacesLayoutActionType.SET_BACK_URL,
)<string | null>();

export const setMainWidth = createStandardAction(
  MultipleSpacesLayoutActionType.SET_MIN_WIDTH,
)<number>();
