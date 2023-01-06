import { AppState } from "@/shared/interfaces";

export const selectUserStateById = (userId: string) => (state: AppState) =>
  state.cache.userStates[userId] || null;

export const selectDiscussionStateById =
  (discussionId: string) => (state: AppState) =>
    state.cache.discussionStates[discussionId] || null;
