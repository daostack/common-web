import { MenuItem as Item } from "@/shared/interfaces";
import { CommonMenuItem } from "../../../constants";
import { useCommonDataContext } from "../../../providers";
import { getAllowedItems, GetAllowedItemsOptions } from "../utils";

type Options = GetAllowedItemsOptions;

export const useMenuItems = (options: Options): Item[] => {
  const allowedMenuItems = getAllowedItems(options);
  const { onMenuItemSelect } = useCommonDataContext();
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
        onMenuItemSelect(CommonMenuItem.LeaveCommon);
      },
    },
    {
      id: CommonMenuItem.LeaveProject,
      text: "Leave space",
      withWarning: true,
      onClick: () => {
        onMenuItemSelect(CommonMenuItem.LeaveProject);
      },
    },
    {
      id: CommonMenuItem.DeleteCommon,
      text: "Delete common",
      withWarning: true,
      onClick: () => {
        onMenuItemSelect(CommonMenuItem.DeleteCommon);
      },
    },
  ];

  return items.filter((item) =>
    allowedMenuItems.includes(item.id as CommonMenuItem),
  );
};
