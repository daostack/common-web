import { MenuItem as Item } from "@/shared/interfaces";
import { SettingsMenuItem } from "../../../constants";
import { getAllowedItems, GetAllowedItemsOptions } from "../utils";

type Options = GetAllowedItemsOptions;

export const useMenuItems = (options: Options): Item[] => {
  const { onAccountDelete } = options;
  const allowedMenuItems = getAllowedItems(options);
  const items: Item[] = [
    {
      id: SettingsMenuItem.DeleteAccount,
      text: "Delete my account",
      onClick: onAccountDelete,
    },
  ];

  return items.filter((item) =>
    allowedMenuItems.includes(item.id as SettingsMenuItem),
  );
};
