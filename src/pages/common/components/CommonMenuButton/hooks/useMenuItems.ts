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
      id: CommonMenuItem.Governance,
      text: "Governance",
      onClick: () => {
        onMenuItemSelect(CommonMenuItem.Governance);
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
      id: CommonMenuItem.DeleteCommonProposal,
      text: `Delete ${options.isSubCommon ? "space" : "common"} propsal`,
      withWarning: true,
      onClick: () => {
        onMenuItemSelect(CommonMenuItem.DeleteCommonProposal);
      },
    },
    {
      id: CommonMenuItem.DeleteCommonAction,
      text: `Delete ${options.isSubCommon ? "space" : "common"} action`,
      withWarning: true,
      onClick: () => {
        onMenuItemSelect(CommonMenuItem.DeleteCommonAction);
      },
    },
  ];

  /**
   * For now we give priority to DeleteCommonAction over DeleteCommonProposal.
   */
  //const filteredItems = allowedMenuItems.includes(CommonMenuItem.DeleteCommonAction) ? allowedMenuItems.filter(item => item !== CommonMenuItem.DeleteCommonProposal) : allowedMenuItems;

  return items.filter((item) =>
    allowedMenuItems.includes(item.id as CommonMenuItem),
  );
};
