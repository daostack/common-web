import { AppState } from "@/shared/interfaces";

export const selectFollowFeedItemMutationState = (state: AppState) =>
  state.commonFeedFollows.followFeedItemMutation;

export const selectCommonFeedFollows = (state: AppState) =>
  state.commonFeedFollows.follows;
