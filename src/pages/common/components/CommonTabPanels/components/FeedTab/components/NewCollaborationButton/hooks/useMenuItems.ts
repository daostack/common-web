import { MenuItem as Item } from "@/shared/interfaces";
import { NewCollaborationMenuItem } from "../../../../../../../constants";
import { useCommonDataContext } from "../../../../../../../providers";
import { getAllowedItems, GetAllowedItemsOptions } from "../utils";

type Options = GetAllowedItemsOptions;

export const useMenuItems = (options: Options): Item[] => {
  const allowedMenuItems = getAllowedItems(options);
  const { onNewCollaborationMenuItemSelect } = useCommonDataContext();
  const items: Item[] = [
    {
      id: NewCollaborationMenuItem.NewProposal,
      text: "New Proposal",
      onClick: () => {
        onNewCollaborationMenuItemSelect(NewCollaborationMenuItem.NewProposal);
      },
    },
    {
      id: NewCollaborationMenuItem.NewDiscussion,
      text: "New Discussion",
      onClick: () => {
        onNewCollaborationMenuItemSelect(
          NewCollaborationMenuItem.NewDiscussion,
        );
      },
    },
    {
      id: NewCollaborationMenuItem.NewContribution,
      text: "New Contribution",
      onClick: () => {
        onNewCollaborationMenuItemSelect(
          NewCollaborationMenuItem.NewContribution,
        );
      },
    },
  ];

  return items.filter((item) =>
    allowedMenuItems.includes(item.id as NewCollaborationMenuItem),
  );
};
