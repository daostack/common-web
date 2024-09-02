import { CommonFeedType } from "@/shared/models";
import { notEmpty } from "@/shared/utils/notEmpty";
import { FeedItemMenuItem, FeedItemPinAction } from "../../FeedItem/constants";
import { GetAllowedItemsOptions } from "../../FeedItem/types";
import { checkIsEditItemAllowed } from "./checkIsEditItemAllowed";
import { checkIsLinkToAllowed } from "./checkIsLinkToAllowed";
import { checkIsMoveToAllowed } from "./checkIsMoveToAllowed";
import { checkIsPinUnpinAllowed } from "./checkIsPinUnpinAllowed";
import { checkIsRemoveDiscussionAllowed } from "./checkIsRemoveDiscussionAllowed";

const MENU_ITEM_TO_CHECK_FUNCTION_MAP: Record<
  FeedItemMenuItem,
  (options: GetAllowedItemsOptions) => boolean
> = {
  [FeedItemMenuItem.Share]: () => true,
  [FeedItemMenuItem.Report]: () => false,
  [FeedItemMenuItem.Edit]: (options) => checkIsEditItemAllowed(options),
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
  [FeedItemMenuItem.MarkUnread]: ({ feedItemUserMetadata }) => {
    const { count, seen, isSeenUpdating } = feedItemUserMetadata || {};

    if (!feedItemUserMetadata) {
      return true;
    }

    if (isSeenUpdating) {
      return false;
    }

    return notEmpty(count) && notEmpty(seen) && count === 0 && seen;
  },
  [FeedItemMenuItem.MarkRead]: ({ feedItemUserMetadata }) => {
    const { count, seenOnce, seen, isSeenUpdating } =
      feedItemUserMetadata || {};

    if (isSeenUpdating) {
      return false;
    }

    return (
      Boolean(count) ||
      (notEmpty(seen) && !seen) ||
      (notEmpty(seenOnce) && !seenOnce)
    );
  },
  [FeedItemMenuItem.LinkTo]: checkIsLinkToAllowed,
  [FeedItemMenuItem.MoveTo]: checkIsMoveToAllowed,
  [FeedItemMenuItem.Unlink]: (options) => {
    return Boolean(
      options.discussion?.linkedCommonIds &&
        options.discussion?.linkedCommonIds.length > 0 &&
        checkIsRemoveDiscussionAllowed(options),
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
    FeedItemMenuItem.MarkUnread,
    FeedItemMenuItem.MarkRead,
    FeedItemMenuItem.Report,
    FeedItemMenuItem.Edit,
    FeedItemMenuItem.LinkTo,
    FeedItemMenuItem.MoveTo,
    FeedItemMenuItem.Unlink,
    FeedItemMenuItem.Remove,
  ];
  const nonAllowedItems =
    options.getNonAllowedItems?.(
      options?.feedItem?.data.type ?? CommonFeedType.Discussion,
      options,
    ) || [];

  return orderedItems.filter(
    (item) =>
      !nonAllowedItems.includes(item) &&
      MENU_ITEM_TO_CHECK_FUNCTION_MAP[item](options),
  );
};
