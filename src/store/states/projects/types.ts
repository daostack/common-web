import { Common } from "@/shared/models";

export interface ProjectsStateItem {
  commonId: string;
  image: string;
  name: string;
  directParent: Common["directParent"];
  hasMembership?: boolean;
  notificationsAmount?: number;
}

export interface ProjectsState {
  data: ProjectsStateItem[];
  isDataLoading: boolean;
  isDataFetched: boolean;
  isCommonCreationDisabled: boolean;
}
