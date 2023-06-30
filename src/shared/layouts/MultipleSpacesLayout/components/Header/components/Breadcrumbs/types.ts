import { ProjectsStateItem } from "@/store/states";

export interface BreadcrumbsItemData {
  activeItemId: string;
  items: ProjectsStateItem[];
}
