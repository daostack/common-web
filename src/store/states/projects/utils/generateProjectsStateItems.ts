import { ROUTE_PATHS } from "@/shared/constants";
import { UserProjectsInfoItem } from "@/shared/interfaces";
import { ProjectsStateItem } from "@/store/states";

const getItemFromUserProjectsInfoItem = (
  userProjectsInfoItem: UserProjectsInfoItem,
  itemsGroupedByCommonParentId: Map<string | null, UserProjectsInfoItem[]>,
): ProjectsStateItem => {
  const { common, hasMembership } = userProjectsInfoItem;
  const items = (itemsGroupedByCommonParentId.get(common.id) || []).map(
    (subCommon) =>
      getItemFromUserProjectsInfoItem(subCommon, itemsGroupedByCommonParentId),
  );

  return {
    id: common.id,
    image: common.image,
    name: common.name,
    path: ROUTE_PATHS.COMMON_DETAIL.replace(":id", common.id),
    hasMembership,
    notificationsAmount: 0,
    items,
  };
};

export const generateProjectsStateItems = (
  data: UserProjectsInfoItem[],
): ProjectsStateItem[] => {
  const itemsGroupedByCommonParentId = data.reduce((map, item) => {
    const commonId = item.common.directParent?.commonId || null;
    const currentGroup = map.get(commonId) || [];
    currentGroup.push(item);
    map.set(commonId, currentGroup);

    return map;
  }, new Map<string | null, UserProjectsInfoItem[]>());
  const mainItems = itemsGroupedByCommonParentId.get(null) || [];

  return mainItems.reduce<ProjectsStateItem[]>(
    (acc, item) =>
      acc.concat(
        getItemFromUserProjectsInfoItem(item, itemsGroupedByCommonParentId),
      ),
    [],
  );
};
