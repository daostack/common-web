import { ProjectsStateItem } from "@/store/states";

const getParentItem = (
  commonId: string,
  data: ProjectsStateItem[],
): ProjectsStateItem | null => {
  let parentItem: ProjectsStateItem | null =
    data.find((item) => item.commonId === commonId) || null;

  while (parentItem !== null && parentItem.directParent !== null) {
    const parentId = parentItem.directParent.commonId;
    parentItem = data.find((item) => item.commonId === parentId) || null;
  }

  return parentItem;
};

const getAllNestedItems = (
  parentItem: ProjectsStateItem,
  data: ProjectsStateItem[],
): ProjectsStateItem[] => {
  const finalItems: ProjectsStateItem[] = [];
  let childrenOfParentIdsToFind = [parentItem.commonId];

  while (childrenOfParentIdsToFind.length > 0) {
    const children = data.filter(
      (item) =>
        item.directParent &&
        childrenOfParentIdsToFind.includes(item.directParent.commonId),
    );
    childrenOfParentIdsToFind = children.map((child) => child.commonId);
    finalItems.push(...children);
  }

  return finalItems;
};

export const getRelatedToIdItems = (
  commonId: string,
  data: ProjectsStateItem[],
): ProjectsStateItem[] => {
  const parentItem = getParentItem(commonId, data);

  return parentItem ? [parentItem, ...getAllNestedItems(parentItem, data)] : [];
};
