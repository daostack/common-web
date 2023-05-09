import {
  Common,
  Circles,
  CommonFeed,
  CommonMember,
  Discussion,
  Proposal,
} from "@/shared/models";

export interface GetAllowedItemsOptions {
  commonId?: string;
  pinnedFeedItems?: Common["pinnedFeedItems"];
  discussion?: Discussion | null;
  governanceCircles?: Circles;
  feedItem?: CommonFeed;
  proposal?: Proposal;
  commonMember?: CommonMember | null;
  isLimitedMenu?: boolean;
}

export enum PinAction {
  Pin = "pin",
  Unpin = "unpin",
}
