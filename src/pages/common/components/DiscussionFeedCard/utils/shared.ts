import {
  Circles,
  CommonFeed,
  CommonMember,
  Discussion,
  Proposal,
} from "@/shared/models";

export interface GetAllowedItemsOptions {
  discussion?: Discussion | null;
  governanceCircles?: Circles;
  feedItem?: CommonFeed;
  proposal?: Proposal;
  commonMember?: CommonMember | null;
}
