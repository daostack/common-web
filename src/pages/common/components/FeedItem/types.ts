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
  getNonAllowedItems?: GetNonAllowedItemsOptions;
}
