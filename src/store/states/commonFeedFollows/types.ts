export interface FollowFeedItemMutationState {
  isFollowingInProgress: boolean;
  isFollowingFinished: boolean;
  isFollowingFinishedWithError?: boolean;
}

export interface CommonFeedFollowsState {
  followFeedItemMutation: Record<string, FollowFeedItemMutationState>;
  follows: Record<string, Record<string, boolean>>;
}
