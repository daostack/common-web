import { DiscussionCardMenuItem } from "../constants";
import { checkIsRemoveDiscussionAllowed } from "./checkIsRemoveDiscussionAllowed";
import { GetAllowedItemsOptions } from "./types";

const MENU_ITEM_TO_CHECK_FUNCTION_MAP: Record<
  DiscussionCardMenuItem,
  (options: GetAllowedItemsOptions) => boolean
> = {
  [DiscussionCardMenuItem.Share]: () => false,
  [DiscussionCardMenuItem.Report]: () => false,
  [DiscussionCardMenuItem.Edit]: () => false,
  [DiscussionCardMenuItem.Remove]: checkIsRemoveDiscussionAllowed,
};

export const getAllowedItems = (
  options: GetAllowedItemsOptions,
): DiscussionCardMenuItem[] => {
  const orderedItems = [
    DiscussionCardMenuItem.Share,
    DiscussionCardMenuItem.Report,
    DiscussionCardMenuItem.Edit,
    DiscussionCardMenuItem.Remove,
  ];

  return orderedItems.filter((item) =>
    MENU_ITEM_TO_CHECK_FUNCTION_MAP[item](options),
  );
};
