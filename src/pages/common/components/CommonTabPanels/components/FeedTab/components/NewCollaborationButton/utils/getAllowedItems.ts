import { NewCollaborationMenuItem } from "../../../../../../../constants";

export type GetAllowedItemsOptions = void;

const MENU_ITEM_TO_CHECK_FUNCTION_MAP: Record<
  NewCollaborationMenuItem,
  (options: GetAllowedItemsOptions) => boolean
> = {
  [NewCollaborationMenuItem.NewProposal]: () => true,
  [NewCollaborationMenuItem.NewDiscussion]: () => true,
  [NewCollaborationMenuItem.NewContribution]: () => true,
};

export const getAllowedItems = (
  options: GetAllowedItemsOptions,
): NewCollaborationMenuItem[] => {
  const orderedItems = [
    NewCollaborationMenuItem.NewProposal,
    NewCollaborationMenuItem.NewDiscussion,
    NewCollaborationMenuItem.NewContribution,
  ];

  return orderedItems.filter((item) =>
    MENU_ITEM_TO_CHECK_FUNCTION_MAP[item](options),
  );
};
