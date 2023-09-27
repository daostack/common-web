import { FeedItemFollowState } from "@/shared/hooks/useCases";
import {
  Common,
  Circles,
  CommonFeed,
  CommonMember,
  Discussion,
  CommonFeedType,
  CommonFeedObjectUserUnique,
  ProposalState,
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
  proposalState?: ProposalState;
  commonMember?: CommonMember | null;
  feedItemFollow: FeedItemFollowState;
  getNonAllowedItems?: GetNonAllowedItemsOptions;
  feedItemUserMetadata: CommonFeedObjectUserUnique | null;
}

export type MenuItemOptions = Omit<GetAllowedItemsOptions, "feedItemFollow">;

export interface FeedItemRef {
  scrollToItem: () => void;
}
