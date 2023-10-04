import { ProjectsStateItem } from "../projects";

export interface CommonLayoutState {
  currentCommonId: string | null;
  lastCommonIdFromFeed: string | null;
  commons: ProjectsStateItem[];
  areCommonsLoading: boolean;
  areCommonsFetched: boolean;
  projects: ProjectsStateItem[];
  areProjectsLoading: boolean;
  areProjectsFetched: boolean;
}

export type { ProjectsStateItem } from "../projects";
