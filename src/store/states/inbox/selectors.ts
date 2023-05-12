import { AppState } from "@/shared/interfaces";

export const selectInboxItems = (state: AppState) => state.inbox.items;

export const selectSharedInboxItem = (state: AppState) =>
  state.inbox.sharedItem;
