import {
  Common,
  Circles,
  CommonFeed,
  CommonMember,
  Discussion,
  Proposal,
} from "@/shared/models";

export interface GetAllowedItemsOptions {
  common?: Common;
  discussion?: Discussion | null;
  governanceCircles?: Circles;
  feedItem?: CommonFeed;
  proposal?: Proposal;
  commonMember?: CommonMember | null;
}

export enum PinAction {
  Pin = "pin",
  Unpin = "unpin",
}
