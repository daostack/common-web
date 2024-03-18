import { ProjectsStateItem } from "@/store/states";
import { Item } from "../../ProjectsTree/types";

export const getItemFromProjectsStateItem = (
  projectsStateItem: ProjectsStateItem,
  generatePath: (projectsStateItem: ProjectsStateItem) => string,
  itemsGroupedByCommonParentId?: Map<string | null, ProjectsStateItem[]>,
  getAdditionalItemData?: (
    projectsStateItem: ProjectsStateItem,
  ) => Partial<Item>,
): Item => {
  const items = itemsGroupedByCommonParentId
    ? (itemsGroupedByCommonParentId.get(projectsStateItem.commonId) || []).map(
        (subCommon) =>
          getItemFromProjectsStateItem(
            subCommon,
            generatePath,
            itemsGroupedByCommonParentId,
            getAdditionalItemData,
          ),
      )
    : [];

  return {
    id: projectsStateItem.commonId,
    image: projectsStateItem.image,
    name: projectsStateItem.name,
    path: generatePath(projectsStateItem),
    hasMembership: projectsStateItem.hasMembership,
    hasPermissionToAddProject: projectsStateItem.hasPermissionToAddProject,
    notificationsAmount: projectsStateItem.notificationsAmount,
    listVisibility: projectsStateItem.listVisibility,
    items,
    ...(getAdditionalItemData?.(projectsStateItem) || {}),
  };
};

export const generateProjectsTreeItems = (
  data: ProjectsStateItem[],
  generatePath: (projectsStateItem: ProjectsStateItem) => string,
  getAdditionalItemData?: (
    projectsStateItem: ProjectsStateItem,
  ) => Partial<Item>,
): Item[] => {
  const itemsGroupedByCommonParentId = data.reduce((map, item) => {
    const commonId = item.directParent?.commonId || null;
    const currentGroup = map.get(commonId) || [];
    currentGroup.push(item);
    map.set(commonId, currentGroup);

    return map;
  }, new Map<string | null, ProjectsStateItem[]>());
  const mainItems = itemsGroupedByCommonParentId.get(null) || [];

  return mainItems.reduce<Item[]>(
    (acc, item) =>
      acc.concat(
        getItemFromProjectsStateItem(
          item,
          generatePath,
          itemsGroupedByCommonParentId,
          getAdditionalItemData,
        ),
      ),
    [],
  );
};
