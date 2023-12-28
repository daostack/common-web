import { GovernanceActions } from "@/shared/constants";
import { PredefinedTypes } from "@/shared/models";
import { hasPermission } from "@/shared/utils";
import { FeedItemPinAction, GetAllowedItemsOptions } from "../../FeedItem";

const PINNED_ITEMS_LIMIT = 7;

export function checkIsPinUnpinAllowed(
  action: FeedItemPinAction,
  options: GetAllowedItemsOptions,
) {
  const { feedItem, commonMember, discussion, pinnedFeedItems = [] } = options;
  const isDiscussionPinned = pinnedFeedItems.some(
    (pinnedFeedItem) => pinnedFeedItem.feedObjectId === feedItem?.id,
  );

  if (!commonMember) {
    return false;
  }

  if (action === FeedItemPinAction.Pin) {
    const hasReachedPinLimit = pinnedFeedItems.length >= PINNED_ITEMS_LIMIT;

    if (isDiscussionPinned || hasReachedPinLimit) {
      return false;
    }
  } else if (
    action === FeedItemPinAction.Unpin &&
    (!isDiscussionPinned ||
      discussion?.predefinedType === PredefinedTypes.General)
  ) {
    return false;
  }

  const isAllowed = hasPermission({
    commonMember,
    governance: {
      circles: options.governanceCircles || {},
    },
    action: GovernanceActions.PIN_OR_UNPIN_FEED_ITEMS,
  });

  return isAllowed;
}
