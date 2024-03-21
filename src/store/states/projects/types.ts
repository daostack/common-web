import { SpaceListVisibility } from "@/shared/interfaces";
import { Common } from "@/shared/models";

export interface ProjectsStateItem {
  commonId: string;
  image: string;
  name: string;
  directParent: Common["directParent"];
  rootCommonId?: string;
  hasAccessToSpace?: boolean;
  hasMembership?: boolean;
  hasPermissionToAddProject?: boolean;
  hasPermissionToLinkToHere?: boolean;
  hasPermissionToMoveToHere?: boolean;
  notificationsAmount?: number;
  listVisibility?: SpaceListVisibility;
}

export interface ProjectsState {
  data: ProjectsStateItem[];
  isDataLoading: boolean;
  isDataFetched: boolean;
  isCommonCreationDisabled: boolean;
}
