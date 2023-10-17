import { ProjectsStateItem } from "@/store/states";

export const sortProjectsStateItemsByName = (
  items: ProjectsStateItem[],
): ProjectsStateItem[] => {
  return [...items].sort((prevItem, nextItem) =>
    prevItem.name < nextItem.name ? -1 : 1,
  );
};
