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
};

export const getAllowedItems = (
  options: GetAllowedItemsOptions,
): DiscussionCardMenuItem[] => {
  const orderedItems = [
    DiscussionCardMenuItem.Share,
    DiscussionCardMenuItem.Report,
    DiscussionCardMenuItem.Edit,
    DiscussionCardMenuItem.Remove,
  ];

  return orderedItems.filter((item) =>
    MENU_ITEM_TO_CHECK_FUNCTION_MAP[item](options),
  );
};
