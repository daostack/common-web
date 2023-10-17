import { ProjectsStateItem } from "../projects";

export interface CommonLayoutState {
  currentCommonId: string | null;
  lastCommonFromFeed: {
    id: string;
    data: {
      name: string;
      image: string;
      isProject: boolean;
      memberCount: number;
    } | null;
  } | null;
  commons: ProjectsStateItem[];
  areCommonsLoading: boolean;
  areCommonsFetched: boolean;
  projects: ProjectsStateItem[];
  areProjectsLoading: boolean;
  areProjectsFetched: boolean;
}

export type { ProjectsStateItem } from "../projects";
