import { createSelector } from "reselect";
import { AppState } from "../../../shared/interfaces";

const selectChat = (state: AppState) => state.chat;

export const selectCurrentDiscussionMessageReply = () =>
  createSelector(selectChat, (state) => state.currentDiscussionMessageReply);
