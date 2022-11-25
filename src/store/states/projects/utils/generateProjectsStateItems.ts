import { ROUTE_PATHS } from "@/shared/constants";
import { Common } from "@/shared/models";
import { ProjectsStateItem } from "@/store/states";

const getItemFromCommon = (
  common: Common,
  commonsGroupedByParentId: Map<string | null, Common[]>,
): ProjectsStateItem => {
  const items = (commonsGroupedByParentId.get(common.id) || []).map(
    (subCommon) => getItemFromCommon(subCommon, commonsGroupedByParentId),
  );

  return {
    id: common.id,
    image: common.image,
    name: common.name,
    path: ROUTE_PATHS.COMMON_DETAIL.replace(":id", common.id),
    hasMembership: false,
    notificationsAmount: 0,
    items,
  };
};

export const generateProjectsStateItems = (
  commons: Common[],
): ProjectsStateItem[] => {
  const commonsGroupedByParentId = commons.reduce((map, common) => {
    const currentGroup = map.get(common.directParent?.commonId || null) || [];
    currentGroup.push(common);

    return map;
  }, new Map<string | null, Common[]>());
  const mainCommons = commonsGroupedByParentId.get(null) || [];

  return mainCommons.reduce<ProjectsStateItem[]>(
    (acc, common) =>
      acc.concat(getItemFromCommon(common, commonsGroupedByParentId)),
    [],
  );
};
