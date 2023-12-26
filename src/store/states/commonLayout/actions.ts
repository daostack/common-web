import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { CommonLayoutActionType } from "./constants";
import { CommonLayoutState, ProjectsStateItem } from "./types";

export const getCommons = createAsyncAction(
  CommonLayoutActionType.GET_COMMONS,
  CommonLayoutActionType.GET_COMMONS_SUCCESS,
  CommonLayoutActionType.GET_COMMONS_FAILURE,
)<
  string | void,
  {
    data: ProjectsStateItem[];
    currentCommonId?: string | null;
  },
  Error
>();

export const getProjects = createAsyncAction(
  CommonLayoutActionType.GET_PROJECTS,
  CommonLayoutActionType.GET_PROJECTS_SUCCESS,
  CommonLayoutActionType.GET_PROJECTS_FAILURE,
)<string, ProjectsStateItem[], Error>();

export const addOrUpdateProject = createStandardAction(
  CommonLayoutActionType.ADD_OR_UPDATE_PROJECT,
)<ProjectsStateItem>();

export const updateCommonOrProject = createStandardAction(
  CommonLayoutActionType.UPDATE_COMMON_OR_PROJECT,
)<{ commonId: string } & Partial<Omit<ProjectsStateItem, "commonId">>>();

export const setCurrentCommonId = createStandardAction(
  CommonLayoutActionType.SET_CURRENT_COMMON_ID,
)<string>();

export const setLastCommonFromFeed = createStandardAction(
  CommonLayoutActionType.SET_LAST_COMMON_FROM_FEED,
)<CommonLayoutState["lastCommonFromFeed"]>();

export const clearData = createStandardAction(
  CommonLayoutActionType.CLEAR_DATA,
)();

export const clearDataExceptOfCurrent = createStandardAction(
  CommonLayoutActionType.CLEAR_DATA_EXCEPT_OF_CURRENT,
)<string>();

export const clearProjects = createStandardAction(
  CommonLayoutActionType.CLEAR_PROJECTS,
)();

export const markDataAsNotFetched = createStandardAction(
  CommonLayoutActionType.MARK_DATA_AS_NOT_FETCHED,
)();

export const removeMembershipFromItemAndChildren = createStandardAction(
  CommonLayoutActionType.REMOVE_MEMBERSHIP_FROM_ITEM_AND_CHILDREN,
)<string>();

export const deleteCommon = createStandardAction(
  CommonLayoutActionType.DELETE_COMMON,
)<{ commonId: string }>();
