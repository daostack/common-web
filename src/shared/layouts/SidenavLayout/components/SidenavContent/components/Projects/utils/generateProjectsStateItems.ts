import { ROUTE_PATHS } from "@/shared/constants";
import { ProjectsStateItem } from "@/store/states";
import { Item } from "../../ProjectsTree/types";

const getItemFromProjectsStateItem = (
  projectsStateItem: ProjectsStateItem,
  itemsGroupedByCommonParentId: Map<string | null, ProjectsStateItem[]>,
): Item => {
  const items = (
    itemsGroupedByCommonParentId.get(projectsStateItem.commonId) || []
  ).map((subCommon) =>
    getItemFromProjectsStateItem(subCommon, itemsGroupedByCommonParentId),
  );

  return {
    id: projectsStateItem.commonId,
    image: projectsStateItem.image,
    name: projectsStateItem.name,
    path: ROUTE_PATHS.COMMON_DETAIL.replace(":id", projectsStateItem.commonId),
    hasMembership: projectsStateItem.hasMembership,
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
