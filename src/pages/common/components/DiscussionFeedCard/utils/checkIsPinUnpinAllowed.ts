import { GovernanceActions } from "@/shared/constants";
import { PredefinedTypes } from "@/shared/models";
import { hasPermission } from "@/shared/utils";
import { GetAllowedItemsOptions, PinAction } from "./types";

export function checkIsPinUnpinAllowed(
  action: PinAction,
  options: GetAllowedItemsOptions,
) {
  const { feedItem, commonMember, discussion, pinnedFeedItems = [] } = options;
  const isDiscussionPinned = pinnedFeedItems.some(
    (pinnedFeedItem) => pinnedFeedItem.feedObjectId === feedItem?.id,
  );

  if (!commonMember) {
    return false;
  }

  if (action === PinAction.Pin) {
    const hasReachedPinLimit = pinnedFeedItems.length >= 3;

    if (isDiscussionPinned || hasReachedPinLimit) {
      return false;
    }
  } else if (
    action === PinAction.Unpin &&
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
    key: GovernanceActions.PIN_OR_UNPIN_FEED_ITEMS,
  });

  return isAllowed;
}
