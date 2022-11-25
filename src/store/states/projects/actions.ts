import { createAsyncAction } from "typesafe-actions";
import { Common } from "@/shared/models";
import { ProjectsActionType } from "./constants";

export const getProjects = createAsyncAction(
  ProjectsActionType.GET_PROJECTS,
  ProjectsActionType.GET_PROJECTS_SUCCESS,
  ProjectsActionType.GET_PROJECTS_FAILURE,
)<
  void,
  {
    commons: Common[];
  },
  Error
>();
