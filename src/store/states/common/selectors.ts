import { AppState } from "@/shared/interfaces";

export const selectDiscussionCreationData = (state: AppState) =>
  state.common.discussionCreation.data;

export const selectIsDiscussionCreationLoading = (state: AppState) =>
  state.common.discussionCreation.loading;

export const selectFeedItems = (state: AppState) => state.common.feedItems;
