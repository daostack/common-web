import { CommonFeedType } from "@/shared/models";
import { FeedItemMenuItem, FeedItemPinAction } from "../../FeedItem/constants";
import { GetAllowedItemsOptions } from "../../FeedItem/types";
import { checkIsPinUnpinAllowed } from "./checkIsPinUnpinAllowed";
import { checkIsRemoveDiscussionAllowed } from "./checkIsRemoveDiscussionAllowed";

const MENU_ITEM_TO_CHECK_FUNCTION_MAP: Record<
  FeedItemMenuItem,
  (options: GetAllowedItemsOptions) => boolean
> = {
  [FeedItemMenuItem.Share]: () => true,
  [FeedItemMenuItem.Report]: () => false,
  [FeedItemMenuItem.Edit]: () => false,
  [FeedItemMenuItem.Remove]: checkIsRemoveDiscussionAllowed,
  [FeedItemMenuItem.Pin]: (options) =>
    checkIsPinUnpinAllowed(FeedItemPinAction.Pin, options),
  [FeedItemMenuItem.Unpin]: (options) =>
    checkIsPinUnpinAllowed(FeedItemPinAction.Unpin, options),
  [FeedItemMenuItem.Follow]: (options) => {
    return (
      !options.feedItemFollow.isDisabled && !options.feedItemFollow.isFollowing
    );
  },
  [FeedItemMenuItem.Unfollow]: (options) => {
    return (
      !options.feedItemFollow.isDisabled && options.feedItemFollow.isFollowing
    );
  },
};

export const getAllowedItems = (
  options: GetAllowedItemsOptions,
): FeedItemMenuItem[] => {
  const orderedItems = [
    FeedItemMenuItem.Follow,
    FeedItemMenuItem.Unfollow,
    FeedItemMenuItem.Pin,
    FeedItemMenuItem.Unpin,
    FeedItemMenuItem.Share,
    FeedItemMenuItem.Report,
    FeedItemMenuItem.Edit,
    FeedItemMenuItem.Remove,
  ];
  const nonAllowedItems =
    options.getNonAllowedItems?.(CommonFeedType.Discussion, options) || [];

  return orderedItems.filter(
    (item) =>
      !nonAllowedItems.includes(item) &&
      MENU_ITEM_TO_CHECK_FUNCTION_MAP[item](options),
  );
};
