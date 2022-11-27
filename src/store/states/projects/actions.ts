import { createAsyncAction } from "typesafe-actions";
import { ProjectsActionType } from "./constants";
import { ProjectsStateItem } from "./types";

export const getProjects = createAsyncAction(
  ProjectsActionType.GET_PROJECTS,
  ProjectsActionType.GET_PROJECTS_SUCCESS,
  ProjectsActionType.GET_PROJECTS_FAILURE,
)<void, ProjectsStateItem[], Error>();
