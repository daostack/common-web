import { Item } from "../types";

export const getItemByPath = (path: string, items: Item[]): Item | null => {
  let finalItem: Item | null = null;
  const isItemFound = items.some((item) => {
    if (item.items && item.items.length > 0) {
      finalItem = getItemByPath(path, item.items);

      if (finalItem) {
        return true;
      }
    }

    finalItem = item;
    return path === item.path;
  });

  return isItemFound ? finalItem : null;
};
