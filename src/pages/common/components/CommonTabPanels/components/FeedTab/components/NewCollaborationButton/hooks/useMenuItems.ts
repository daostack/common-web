import { MenuItem as Item } from "@/shared/interfaces";
import { MenuItem } from "../constants";
import { getAllowedItems, GetAllowedItemsOptions } from "../utils";

type Options = GetAllowedItemsOptions;

export const useMenuItems = (options: Options): Item[] => {
  const allowedMenuItems = getAllowedItems(options);
  const items: Item[] = [
    {
      id: MenuItem.NewProposal,
      text: "New Proposal",
      onClick: () => {
        console.log(MenuItem.NewProposal);
      },
    },
    {
      id: MenuItem.NewDiscussion,
      text: "New Discussion",
      onClick: () => {
        console.log(MenuItem.NewDiscussion);
      },
    },
    {
      id: MenuItem.NewContribution,
      text: "New Contribution",
      onClick: () => {
        console.log(MenuItem.NewContribution);
      },
    },
  ];

  return items.filter((item) => allowedMenuItems.includes(item.id as MenuItem));
};
