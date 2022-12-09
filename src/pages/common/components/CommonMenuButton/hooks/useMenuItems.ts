import { CommonMenuItem } from "../constants";
import { Item } from "../types";
import { getAllowedItems, GetAllowedItemsOptions } from "../utils";

type Options = GetAllowedItemsOptions;

export const useMenuItems = (options: Options): Item[] => {
  const allowedMenuItems = getAllowedItems(options);
  const items: Item[] = [
    {
      id: CommonMenuItem.InviteToCircle,
      text: "Invite to circle",
      onClick: () => {
        console.log(CommonMenuItem.InviteToCircle);
      },
    },
    {
      id: CommonMenuItem.LeaveCommon,
      text: "Leave common",
      withWarning: true,
      onClick: () => {
        console.log(CommonMenuItem.LeaveCommon);
      },
    },
    {
      id: CommonMenuItem.DeleteCommon,
      text: "Delete common",
      withWarning: true,
      onClick: () => {
        console.log(CommonMenuItem.DeleteCommon);
      },
    },
  ];

  return items.filter((item) => allowedMenuItems.includes(item.id));
};
