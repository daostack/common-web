import {
  FeedItemMenuItem,
  FeedItemPinAction,
  GetAllowedItemsOptions,
} from "../../FeedItem";
import { checkIsPinUnpinAllowed } from "./checkIsPinUnpinAllowed";
import { checkIsRemoveDiscussionAllowed } from "./checkIsRemoveDiscussionAllowed";

const MENU_ITEMS_TO_LIMIT = [
  FeedItemMenuItem.Pin,
  FeedItemMenuItem.Unpin,
  FeedItemMenuItem.Remove,
];

const MENU_ITEM_TO_CHECK_FUNCTION_MAP: Record<
  FeedItemMenuItem,
  (options: GetAllowedItemsOptions) => boolean
> = {
  [FeedItemMenuItem.Share]: () => false,
  [FeedItemMenuItem.Report]: () => false,
  [FeedItemMenuItem.Edit]: () => false,
  [FeedItemMenuItem.Remove]: checkIsRemoveDiscussionAllowed,
  [FeedItemMenuItem.Pin]: (options) =>
    checkIsPinUnpinAllowed(FeedItemPinAction.Pin, options),
  [FeedItemMenuItem.Unpin]: (options) =>
    checkIsPinUnpinAllowed(FeedItemPinAction.Unpin, options),
};

export const getAllowedItems = (
  options: GetAllowedItemsOptions,
): FeedItemMenuItem[] => {
  const orderedItems = [
    FeedItemMenuItem.Pin,
    FeedItemMenuItem.Unpin,
    FeedItemMenuItem.Share,
    FeedItemMenuItem.Report,
    FeedItemMenuItem.Edit,
    FeedItemMenuItem.Remove,
  ];

  return orderedItems.filter(
    (item) =>
      (!options.isLimitedMenu || !MENU_ITEMS_TO_LIMIT.includes(item)) &&
      MENU_ITEM_TO_CHECK_FUNCTION_MAP[item](options),
  );
};
