export interface ProjectsStateItem {
  id: string;
  image: string;
  name: string;
  path: string;
  hasMembership?: boolean;
  notificationsAmount?: number;
  items?: ProjectsStateItem[];
}

export interface ProjectsState {
  data: ProjectsStateItem[];
  isDataLoading: boolean;
  isDataFetched: boolean;
}
