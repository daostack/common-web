import { createSelector } from "reselect";
import { AppState } from "@/shared/interfaces";

// Base Selector for inbox
const selectInboxState = (state: AppState) => state.inbox;

// Inbox Items
export const selectInboxItems = createSelector(
  selectInboxState,
  (inbox) => inbox.items
);

// Shared Inbox Item
export const selectSharedInboxItem = createSelector(
  selectInboxState,
  (inbox) => inbox.sharedItem
);

// Chat Channel Items
export const selectChatChannelItems = createSelector(
  selectInboxState,
  (inbox) => inbox.chatChannelItems
);

// Next Chat Channel Item ID
export const selectNextChatChannelItemId = createSelector(
  selectInboxState,
  (inbox) => inbox.nextChatChannelItemId
);

// Search State
const selectInboxSearchState = createSelector(
  selectInboxState,
  (inbox) => inbox.searchState
);

// Filtered Inbox Items
export const selectFilteredInboxItems = createSelector(
  selectInboxSearchState,
  (searchState) => searchState.items
);

// Inbox Search Value
export const selectInboxSearchValue = createSelector(
  selectInboxSearchState,
  (searchState) => searchState.searchValue
);

// Is Searching Inbox Items
export const selectIsSearchingInboxItems = createSelector(
  selectInboxSearchState,
  (searchState) => searchState.isSearching
);
