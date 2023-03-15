import { MenuItem } from "@/shared/interfaces";
import { ProjectsStateItem } from "@/store/states";

interface Options {
  stateItems: ProjectsStateItem[];
  onCommonClick: (commonId: string) => void;
}

export const useMenuItems = (options: Options): MenuItem[] => {
  const { stateItems, onCommonClick } = options;
  const items: MenuItem[] = stateItems.map((stateItem) => ({
    id: stateItem.commonId,
    text: stateItem.name,
    onClick: () => {
      onCommonClick(stateItem.commonId);
    },
  }));

  return items;
};
