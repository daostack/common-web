import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { FollowFeedItemPayload } from "@/shared/interfaces/api";
import { CommonFeedFollowsActionType } from "./constants";

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
)<{
  itemId: string;
  commonId: string;
  isFollowing: boolean;
}>();
