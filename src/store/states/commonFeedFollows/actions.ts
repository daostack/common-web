import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { FollowFeedItemPayload } from "@/shared/interfaces/api";
import { CommonFeedFollowsActionType } from "./constants";
import { FollowFeedItemMutationState } from "./types";

export const followFeedItem = createAsyncAction(
  CommonFeedFollowsActionType.FOLLOW_FEED_ITEM,
  CommonFeedFollowsActionType.FOLLOW_FEED_ITEM_SUCCESS,
  CommonFeedFollowsActionType.FOLLOW_FEED_ITEM_FAILURE,
  CommonFeedFollowsActionType.FOLLOW_FEED_ITEM_CANCEL,
)<
  FollowFeedItemPayload,
  FollowFeedItemPayload,
  FollowFeedItemPayload & { error: Error },
  FollowFeedItemPayload
>();

export const setFeedItemFollow = createStandardAction(
  CommonFeedFollowsActionType.SET_FEED_ITEM_FOLLOW,
)<FollowFeedItemPayload>();

export const setFeedItemsFollowStateByCommon = createStandardAction(
  CommonFeedFollowsActionType.SET_FEED_ITEMS_FOLLOW_STATE_BY_COMMON,
)<{
  commonId: string;
  isFollowing: boolean;
  mutationState: FollowFeedItemMutationState;
}>();
