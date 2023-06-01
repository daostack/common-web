import { AppState } from "@/shared/interfaces";

export const selectInboxItems = (state: AppState) => state.inbox.items;

export const selectSharedInboxItem = (state: AppState) =>
  state.inbox.sharedItem;

export const selectChatChannelItems = (state: AppState) =>
  state.inbox.chatChannelItems;

export const selectNextChatChannelItemId = (state: AppState) =>
  state.inbox.nextChatChannelItemId;
