import { getCommonPageAboutTabPath, getCommonPagePath } from "@/shared/utils";
import { ProjectsStateItem } from "@/store/states";
import { Item } from "../../ProjectsTree/types";

export const getItemFromProjectsStateItem = (
  projectsStateItem: ProjectsStateItem,
  itemsGroupedByCommonParentId?: Map<string | null, ProjectsStateItem[]>,
): Item => {
  const items = itemsGroupedByCommonParentId
    ? (itemsGroupedByCommonParentId.get(projectsStateItem.commonId) || []).map(
        (subCommon) =>
          getItemFromProjectsStateItem(subCommon, itemsGroupedByCommonParentId),
      )
    : [];

  return {
    id: projectsStateItem.commonId,
    image: projectsStateItem.image,
    name: projectsStateItem.name,
    path: projectsStateItem.hasMembership
      ? getCommonPagePath(projectsStateItem.commonId)
      : getCommonPageAboutTabPath(projectsStateItem.commonId),
    hasMembership: projectsStateItem.hasMembership,
    hasPermissionToAddProject: projectsStateItem.hasPermissionToAddProject,
    notificationsAmount: projectsStateItem.notificationsAmount,
    items,
  };
};

export const generateProjectsTreeItems = (
  data: ProjectsStateItem[],
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
        getItemFromProjectsStateItem(item, itemsGroupedByCommonParentId),
      ),
    [],
  );
};
