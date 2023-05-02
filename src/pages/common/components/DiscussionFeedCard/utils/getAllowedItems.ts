import { FeedItemFollowState } from "@/shared/hooks/useCases";
import {
  Circles,
  CommonFeed,
  CommonMember,
  Discussion,
  Proposal,
  Common,
} from "@/shared/models";
import { DiscussionCardMenuItem } from "../constants";

export interface GetAllowedItemsOptions {
  common?: Common;
  discussion?: Discussion | null;
  governanceCircles?: Circles;
  feedItem?: CommonFeed;
  proposal?: Proposal;
  commonMember?: CommonMember | null;
  feedItemFollow: FeedItemFollowState;
}

const MENU_ITEM_TO_CHECK_FUNCTION_MAP: Record<
  DiscussionCardMenuItem,
  (options: GetAllowedItemsOptions) => boolean
> = {
  [DiscussionCardMenuItem.Share]: () => false,
  [DiscussionCardMenuItem.Report]: () => false,
  [DiscussionCardMenuItem.Edit]: () => false,
  [DiscussionCardMenuItem.Remove]: () => false,
  [DiscussionCardMenuItem.Follow]: (options) => {
    return (
      !options.feedItemFollow.isDisabled && !options.feedItemFollow.isFollowing
    );
  },
  [DiscussionCardMenuItem.Unfollow]: (options) => {
    return (
      !options.feedItemFollow.isDisabled && options.feedItemFollow.isFollowing
    );
  },
};

export const getAllowedItems = (
  options: GetAllowedItemsOptions,
): DiscussionCardMenuItem[] => {
  const orderedItems = [
    DiscussionCardMenuItem.Follow,
    DiscussionCardMenuItem.Unfollow,
    DiscussionCardMenuItem.Share,
    DiscussionCardMenuItem.Report,
    DiscussionCardMenuItem.Edit,
    DiscussionCardMenuItem.Remove,
  ];

  return orderedItems.filter((item) =>
    MENU_ITEM_TO_CHECK_FUNCTION_MAP[item](options),
  );
};
