import { createSelector } from "reselect";
import { AppState } from "@/shared/interfaces";

// Base Selector for commonFeedFollows
const selectCommonFeedFollowsState = (state: AppState) =>
  state.commonFeedFollows;

// Follow Feed Item Mutation State
export const selectFollowFeedItemMutationState = createSelector(
  selectCommonFeedFollowsState,
  (feedFollows) => feedFollows.followFeedItemMutation
);

export const selectFollowFeedItemMutationStateById = (mutationId?: string) =>
  createSelector(
    selectFollowFeedItemMutationState,
    (mutationState) => (mutationId ? mutationState[mutationId] || null : null)
  );

// Common Feed Follows
export const selectCommonFeedFollows = createSelector(
  selectCommonFeedFollowsState,
  (feedFollows) => feedFollows.follows
);

export const selectCommonFeedFollowsByIds = (commonId?: string, feedItemId?: string) =>
  createSelector(
    selectCommonFeedFollows,
    (follows) =>
      commonId && feedItemId
        ? follows[commonId]?.[feedItemId] || false
        : false
  );
