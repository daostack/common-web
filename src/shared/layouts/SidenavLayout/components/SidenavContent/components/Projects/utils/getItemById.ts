import { Item } from "../../ProjectsTree/types";

export const getItemById = (itemId: string, items: Item[]): Item | null =>
  items.find((item) => item.id === itemId) || null;
