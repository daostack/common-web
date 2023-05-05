import { DiscussionCardMenuItem } from "../constants";
import { checkIsPinUnpinAllowed } from "./checkIsPinUnpinAllowed";
import { GetAllowedItemsOptions, PinAction } from "./types";

const MENU_ITEM_TO_CHECK_FUNCTION_MAP: Record<
  DiscussionCardMenuItem,
  (options: GetAllowedItemsOptions) => boolean
> = {
  [DiscussionCardMenuItem.Share]: () => false,
  [DiscussionCardMenuItem.Report]: () => false,
  [DiscussionCardMenuItem.Edit]: () => false,
  [DiscussionCardMenuItem.Remove]: () => false,
  [DiscussionCardMenuItem.Pin]: (options) =>
    checkIsPinUnpinAllowed(PinAction.Pin, options),
  [DiscussionCardMenuItem.Unpin]: (options) =>
    checkIsPinUnpinAllowed(PinAction.Unpin, options),
};

export const getAllowedItems = (
  options: GetAllowedItemsOptions,
): DiscussionCardMenuItem[] => {
  const orderedItems = [
    DiscussionCardMenuItem.Pin,
    DiscussionCardMenuItem.Unpin,
    DiscussionCardMenuItem.Share,
    DiscussionCardMenuItem.Report,
    DiscussionCardMenuItem.Edit,
    DiscussionCardMenuItem.Remove,
  ];

  return orderedItems.filter((item) =>
    MENU_ITEM_TO_CHECK_FUNCTION_MAP[item](options),
  );
};
