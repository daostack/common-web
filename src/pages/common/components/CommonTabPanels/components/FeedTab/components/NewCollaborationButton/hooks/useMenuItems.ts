import { MenuItem as Item } from "@/shared/interfaces";
import { NewCollaborationMenuItem } from "../../../../../../../constants";
import { getAllowedItems, GetAllowedItemsOptions } from "../utils";

type Options = GetAllowedItemsOptions;

export const useMenuItems = (options: Options): Item[] => {
  const allowedMenuItems = getAllowedItems(options);
  const items: Item[] = [
    {
      id: NewCollaborationMenuItem.NewProposal,
      text: "New Proposal",
      onClick: () => {
        console.log(NewCollaborationMenuItem.NewProposal);
      },
    },
    {
      id: NewCollaborationMenuItem.NewDiscussion,
      text: "New Discussion",
      onClick: () => {
        console.log(NewCollaborationMenuItem.NewDiscussion);
      },
    },
    {
      id: NewCollaborationMenuItem.NewContribution,
      text: "New Contribution",
      onClick: () => {
        console.log(NewCollaborationMenuItem.NewContribution);
      },
    },
  ];

  return items.filter((item) =>
    allowedMenuItems.includes(item.id as NewCollaborationMenuItem),
  );
};
