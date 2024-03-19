import { AppState } from "@/shared/interfaces";

export const selectFollowFeedItemMutationState = (state: AppState) =>
  state.commonFeedFollows.followFeedItemMutation;

export const selectFollowFeedItemMutationStateById =
  (mutationId?: string) => (state: AppState) =>
    (mutationId &&
      state.commonFeedFollows.followFeedItemMutation[mutationId]) ||
    null;

export const selectCommonFeedFollows = (state: AppState) =>
  state.commonFeedFollows.follows;

export const selectCommonFeedFollowsByIds =
  (commonId?: string, feedItemId?: string) => (state: AppState) =>
    (commonId &&
      feedItemId &&
      state.commonFeedFollows.follows[commonId]?.[feedItemId]) ||
    false;
