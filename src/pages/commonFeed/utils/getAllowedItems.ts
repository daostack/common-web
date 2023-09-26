import { MenuItem as Item } from "@/shared/interfaces";
import { CirclesPermissions, Common, CommonMember } from "@/shared/models";
import { CommonFeedMenuItem } from "../constants";

export interface Options {
  common: Common;
  commonMember: (CommonMember & CirclesPermissions) | null;
  isFollowInProgress: boolean;
  isMobileVersion: boolean;
}

const MENU_ITEM_TO_CHECK_FUNCTION_MAP: Record<
  CommonFeedMenuItem,
  (options: Options) => boolean
> = {
  [CommonFeedMenuItem.Share]: ({ isMobileVersion }) => !isMobileVersion,
  [CommonFeedMenuItem.Follow]: ({ commonMember, isFollowInProgress }) =>
    !isFollowInProgress && Boolean(commonMember && !commonMember.isFollowing),
  [CommonFeedMenuItem.Mute]: ({ commonMember, isFollowInProgress }) =>
    !isFollowInProgress && Boolean(commonMember?.isFollowing),
};

export const getAllowedItems = (items: Item[], options: Options): Item[] =>
  items.filter(({ id }) => MENU_ITEM_TO_CHECK_FUNCTION_MAP[id](options));