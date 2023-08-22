import { ProjectsStateItem } from "@/store/states";

export const getParentItemIds = (
  activeItemId: string,
  items: ProjectsStateItem[],
): string[] => {
  const parentItemIds: string[] = [];
  let item = items.find(({ commonId }) => activeItemId === commonId);

  while (item?.directParent) {
    const parentId = item.directParent.commonId;
    parentItemIds.unshift(parentId);

    item = items.find(({ commonId }) => parentId === commonId);
  }

  return parentItemIds;
};
