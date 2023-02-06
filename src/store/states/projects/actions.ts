import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { ProjectsActionType } from "./constants";
import { ProjectsStateItem } from "./types";

export const getProjects = createAsyncAction(
  ProjectsActionType.GET_PROJECTS,
  ProjectsActionType.GET_PROJECTS_SUCCESS,
  ProjectsActionType.GET_PROJECTS_FAILURE,
)<string | void, ProjectsStateItem[], Error>();

export const addProject = createStandardAction(
  ProjectsActionType.ADD_PROJECT,
)<ProjectsStateItem>();

export const updateProject = createStandardAction(
  ProjectsActionType.UPDATE_PROJECT,
)<{ commonId: string } & Partial<Omit<ProjectsStateItem, "commonId">>>();

export const clearProjects = createStandardAction(
  ProjectsActionType.CLEAR_PROJECTS,
)();

export const clearProjectsExceptOfCurrent = createStandardAction(
  ProjectsActionType.CLEAR_PROJECTS_EXCEPT_OF_CURRENT,
)<string>();

export const markProjectsAsNotFetched = createStandardAction(
  ProjectsActionType.MARK_PROJECTS_AS_NOT_FETCHED,
)();

export const removeMembershipFromProjectAndChildren = createStandardAction(
  ProjectsActionType.REMOVE_MEMBERSHIP_FROM_PROJECT_AND_CHILDREN,
)<string>();
