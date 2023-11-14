import { ProjectsStateItem } from "../projects";

interface LastCommonFromFeedData {
  name: string;
  image: string;
  isProject: boolean;
  memberCount: number;
}

interface LastCommonFromFeed {
  id: string;
  data:
    | (LastCommonFromFeedData & {
        rootCommon: {
          id: string;
          data: LastCommonFromFeedData | null;
        } | null;
      })
    | null;
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
