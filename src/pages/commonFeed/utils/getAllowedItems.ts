import { MenuItem as Item } from "@/shared/interfaces";
import { CirclesPermissions, Common, CommonMember } from "@/shared/models";
import { CommonFeedMenuItem } from "../constants";
import { ShareButtonText } from "@/shared/constants";

export interface Options {
  common: Common;
  commonMember: (CommonMember & CirclesPermissions) | null;
  isFollowInProgress: boolean;
  isSearchActionAvailable: boolean;
  shareText?: ShareButtonText;
}

const MENU_ITEM_TO_CHECK_FUNCTION_MAP: Record<
  CommonFeedMenuItem,
  (options: Options) => boolean
> = {
  [CommonFeedMenuItem.Search]: ({ isSearchActionAvailable }) =>
    isSearchActionAvailable,
  [CommonFeedMenuItem.Share]: () => true,
  [CommonFeedMenuItem.Follow]: ({ commonMember, isFollowInProgress }) =>
    !isFollowInProgress && Boolean(commonMember && !commonMember.isFollowing),
  [CommonFeedMenuItem.Mute]: ({ commonMember, isFollowInProgress }) =>
    !isFollowInProgress && Boolean(commonMember?.isFollowing),
  [CommonFeedMenuItem.MarkRead]: () => true,
};

export const getAllowedItems = (items: Item[], options: Options): Item[] =>
  items.filter(({ id }) => MENU_ITEM_TO_CHECK_FUNCTION_MAP[id](options));
