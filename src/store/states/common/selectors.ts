import { AppState } from "@/shared/interfaces";

export const selectDiscussionCreationData = (state: AppState) =>
  state.common.discussionCreationData;

export const selectFeedItems = (state: AppState) => state.common.feedItems;
