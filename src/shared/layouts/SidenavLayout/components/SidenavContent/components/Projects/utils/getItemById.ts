import { Item } from "../../ProjectsTree/types";

export const getItemById = (itemId: string, items: Item[]): Item | null => {
  let finalItem: Item | null = null;
  const isItemFound = items.some((item) => {
    if (item.id === itemId) {
      finalItem = item;

      return true;
    }

    if (item.items && item.items.length > 0) {
      finalItem = getItemById(itemId, item.items);

      if (finalItem) {
        return true;
      }
    }
  });

  return isItemFound ? finalItem : null;
};
