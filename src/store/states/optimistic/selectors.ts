import { AppState } from "@/shared/interfaces";


export const selectOptimisticFeedItems = (state: AppState) =>
  state.optimistic.optimisticFeedItems;

export const selectOptimisticInboxFeedItems = (state: AppState) =>
  state.optimistic.optimisticInboxFeedItems;

export const selectOptimisticDiscussionMessages = (state: AppState) =>
  state.optimistic.optimisticDiscussionMessages;

export const selectCreatedOptimisticFeedItems = (state: AppState) =>
  state.optimistic.createdOptimisticFeedItems;
