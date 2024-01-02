import { ProjectsStateItem } from "../projects";

interface LastCommonFromFeed {
  id: string;
  data: {
    name: string;
    image: string;
    isProject: boolean;
    memberCount: number;
  } | null;
}

export interface CommonLayoutState {
  currentCommonId: string | null;
  lastCommonFromFeed: LastCommonFromFeed | null;
  commons: ProjectsStateItem[];
  areCommonsLoading: boolean;
  areCommonsFetched: boolean;
  projects: ProjectsStateItem[];
  areProjectsLoading: boolean;
  areProjectsFetched: boolean;
}

export type { ProjectsStateItem } from "../projects";
