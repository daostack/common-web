import { MenuItem } from "@/shared/interfaces";
import { ProjectsStateItem } from "@/store/states";
import { CREATE_COMMON_ITEM_ID } from "../constants";

interface Options {
  stateItems: ProjectsStateItem[];
  activeStateItemId?: string | null;
  onCommonClick: (commonId: string) => void;
  onCommonCreationClick: () => void;
}

export const useMenuItems = (options: Options): MenuItem[] => {
  const {
    stateItems,
    activeStateItemId,
    onCommonClick,
    onCommonCreationClick,
  } = options;
  const items: MenuItem[] = stateItems
    .map((stateItem) => ({
      id: stateItem.commonId,
      text: stateItem.name,
      onClick: () => {
        onCommonClick(stateItem.commonId);
      },
    }))
    .sort((item) => (item.id === activeStateItemId ? -1 : 1))
    .concat({
      id: CREATE_COMMON_ITEM_ID,
      text: "Create a common",
      onClick: onCommonCreationClick,
    });

  return items;
};
