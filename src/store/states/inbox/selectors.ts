import { AppState } from "@/shared/interfaces";

export const selectInboxItems = (state: AppState) => state.inbox.items;

export const selectSharedInboxItem = (state: AppState) =>
  state.inbox.sharedItem;

export const selectChatChannelItems = (state: AppState) =>
  state.inbox.chatChannelItems;

export const selectNextChatChannelItemId = (state: AppState) =>
  state.inbox.nextChatChannelItemId;

export const selectFilteredInboxItems = (state: AppState) =>
  state.inbox.searchState.items;

export const selectInboxSearchValue = (state: AppState) =>
  state.inbox.searchState.searchValue;

export const selectIsSearchingInboxItems = (state: AppState) =>
  state.inbox.searchState.isSearching;
