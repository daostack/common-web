import { SettingsMenuItem } from "../../../constants";

export interface GetAllowedItemsOptions {
  onAccountDelete: () => void;
}

const MENU_ITEM_TO_CHECK_FUNCTION_MAP: Record<
  SettingsMenuItem,
  (options: GetAllowedItemsOptions) => boolean
> = {
  [SettingsMenuItem.DeleteAccount]: () => true,
};

export const getAllowedItems = (
  options: GetAllowedItemsOptions,
): SettingsMenuItem[] => {
  const orderedItems = [SettingsMenuItem.DeleteAccount];

  return orderedItems.filter((item) =>
    MENU_ITEM_TO_CHECK_FUNCTION_MAP[item](options),
  );
};
