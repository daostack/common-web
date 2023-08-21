import { Item } from "../../ProjectsTree/types";

export const getHasActiveChild = (
  root: Item,
  activeItemId?: string,
): boolean => {
  if (!activeItemId) {
    return false;
  }

  const queue = [root];

  while (queue.length > 0) {
    const length = queue.length;

    for (let i = 0; i < length; i++) {
      const item = queue.shift()!;

      if (item.id === activeItemId && item.id !== root.id) {
        return true;
      }

      if (item.items && item.items.length > 0) {
        queue.push(...item.items);
      }
    }
  }

  return false;
};
