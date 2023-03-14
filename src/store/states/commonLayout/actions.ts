import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { CommonLayoutActionType } from "./constants";
import { ProjectsStateItem } from "./types";

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

export const clearData = createStandardAction(
  CommonLayoutActionType.CLEAR_DATA,
)();

export const clearDataExceptOfCurrent = createStandardAction(
  CommonLayoutActionType.CLEAR_DATA_EXCEPT_OF_CURRENT,
)<string>();

export const markDataAsNotFetched = createStandardAction(
  CommonLayoutActionType.MARK_DATA_AS_NOT_FETCHED,
)();

export const removeMembershipFromItemAndChildren = createStandardAction(
  CommonLayoutActionType.REMOVE_MEMBERSHIP_FROM_ITEM_AND_CHILDREN,
)<string>();
