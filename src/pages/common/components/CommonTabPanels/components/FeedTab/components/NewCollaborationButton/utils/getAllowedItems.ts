import { MenuItem } from "../constants";

export type GetAllowedItemsOptions = void;

const MENU_ITEM_TO_CHECK_FUNCTION_MAP: Record<
  MenuItem,
  (options: GetAllowedItemsOptions) => boolean
> = {
  [MenuItem.NewProposal]: () => true,
  [MenuItem.NewDiscussion]: () => true,
  [MenuItem.NewContribution]: () => true,
};

export const getAllowedItems = (
  options: GetAllowedItemsOptions,
): MenuItem[] => {
  const orderedItems = [
    MenuItem.NewProposal,
    MenuItem.NewDiscussion,
    MenuItem.NewContribution,
  ];

  return orderedItems.filter((item) =>
    MENU_ITEM_TO_CHECK_FUNCTION_MAP[item](options),
  );
};
