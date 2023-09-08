import { FeedItemFollowState } from "@/shared/hooks/useCases";
import {
  Common,
  Circles,
  CommonFeed,
  CommonMember,
  Discussion,
  Proposal,
  CommonFeedType,
} from "@/shared/models";
import { FeedItemMenuItem } from "./constants";

export type GetNonAllowedItemsOptions = (
  type: CommonFeedType,
  options?: GetAllowedItemsOptions,
) => FeedItemMenuItem[];

export interface GetAllowedItemsOptions {
  commonId?: string;
  pinnedFeedItems?: Common["pinnedFeedItems"];
  discussion?: Discussion | null;
  governanceCircles?: Circles;
  feedItem?: CommonFeed;
  proposal?: Proposal;
  commonMember?: CommonMember | null;
  feedItemFollow: FeedItemFollowState;
  getNonAllowedItems?: GetNonAllowedItemsOptions;
}

export type MenuItemOptions = Omit<GetAllowedItemsOptions, "feedItemFollow">;

export interface FeedItemRef {
  scrollToItem: () => void;
}
