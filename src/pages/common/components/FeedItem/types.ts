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

export interface GetAllowedItemsOptions {
  commonId?: string;
  pinnedFeedItems?: Common["pinnedFeedItems"];
  discussion?: Discussion | null;
  governanceCircles?: Circles;
  feedItem?: CommonFeed;
  proposal?: Proposal;
  commonMember?: CommonMember | null;
  getNonAllowedItems?: (
    type: CommonFeedType,
    options?: GetAllowedItemsOptions,
  ) => FeedItemMenuItem[];
}
