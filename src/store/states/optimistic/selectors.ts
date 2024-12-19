import { createSelector } from "reselect";
import { AppState } from "@/shared/interfaces";

// Base Selector for optimistic state
const selectOptimisticState = (state: AppState) => state.optimistic;

// Optimistic Feed Items
export const selectOptimisticFeedItems = createSelector(
  selectOptimisticState,
  (optimistic) => optimistic.optimisticFeedItems
);

// Optimistic Inbox Feed Items
export const selectOptimisticInboxFeedItems = createSelector(
  selectOptimisticState,
  (optimistic) => optimistic.optimisticInboxFeedItems
);

// Optimistic Discussion Messages
export const selectOptimisticDiscussionMessages = createSelector(
  selectOptimisticState,
  (optimistic) => optimistic.optimisticDiscussionMessages
);

// Created Optimistic Feed Items
export const selectCreatedOptimisticFeedItems = createSelector(
  selectOptimisticState,
  (optimistic) => optimistic.createdOptimisticFeedItems
);

// Instant Discussion Messages Order
export const selectInstantDiscussionMessagesOrder = createSelector(
  selectOptimisticState,
  (optimistic) => optimistic.instantDiscussionMessagesOrder
);
