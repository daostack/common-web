import { AppState } from "@/shared/interfaces";

export const selectDiscussionCreationData = (state: AppState) =>
  state.common.discussionCreationData;
