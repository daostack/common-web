import {
  Circles,
  CommonFeed,
  CommonMember,
  Discussion,
  Proposal,
  Common,
  PredefinedTypes,
} from "@/shared/models";
import { GovernanceActions } from "../../../../../shared/constants";
import { hasPermission } from "../../../../../shared/utils";
import { DiscussionCardMenuItem } from "../constants";

export interface GetAllowedItemsOptions {
  common?: Common;
  discussion?: Discussion | null;
  governanceCircles?: Circles;
  feedItem?: CommonFeed;
  proposal?: Proposal;
  commonMember?: CommonMember | null;
}

const MENU_ITEM_TO_CHECK_FUNCTION_MAP: Record<
  DiscussionCardMenuItem,
  (options: GetAllowedItemsOptions) => boolean
> = {
  [DiscussionCardMenuItem.Share]: () => false,
  [DiscussionCardMenuItem.Report]: () => false,
  [DiscussionCardMenuItem.Edit]: () => false,
  [DiscussionCardMenuItem.Remove]: () => false,
  [DiscussionCardMenuItem.Pin]: (options) => {
    const { feedItem, commonMember } = options;
    const pinnedFeedItems = options.common?.pinnedFeedItems || [];
    const isDiscussionPinned = pinnedFeedItems.some(
      (pinnedFeedItem) => pinnedFeedItem.feedObjectId === feedItem?.id,
    );
    const hasReachedPinLimit = pinnedFeedItems.length >= 3;
    if (isDiscussionPinned || hasReachedPinLimit || !commonMember) return false;
    const isAllowed = hasPermission({
      commonMember,
      governance: {
        circles: options.governanceCircles || {},
      },
      key: GovernanceActions.PIN_OR_UNPIN_FEED_ITEMS,
    });
    return isAllowed;
  },
  [DiscussionCardMenuItem.Unpin]: (options) => {
    const { feedItem, commonMember, discussion } = options;
    const pinnedFeedItems = options.common?.pinnedFeedItems || [];
    const isDiscussionPinned = pinnedFeedItems.some(
      (pinnedFeedItem) => pinnedFeedItem.feedObjectId === feedItem?.id,
    );
    if (
      !isDiscussionPinned ||
      discussion?.predefinedType === PredefinedTypes.General ||
      !commonMember
    )
      return false;
    const isAllowed = hasPermission({
      commonMember,
      governance: {
        circles: options.governanceCircles || {},
      },
      key: GovernanceActions.PIN_OR_UNPIN_FEED_ITEMS,
    });
    return isAllowed;
  },
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
