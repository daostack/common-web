import produce from "immer";
import { ActionType, createReducer } from "typesafe-actions";
import * as actions from "./actions";
import { ChatState } from "./types";

const initialState: ChatState = {
  currentDiscussionMessageReply: null,
  filesPreview: null,
};

type Action = ActionType<typeof actions>;

export const reducer = createReducer<ChatState, Action>(initialState)
  .handleAction(
    actions.setCurrentDiscussionMessageReply,
    (state, { payload }) =>
      produce(state, (nextState) => {
        nextState.currentDiscussionMessageReply = payload;
      }),
  )
  .handleAction(actions.clearCurrentDiscussionMessageReply, (state) =>
    produce(state, (nextState) => {
      nextState.currentDiscussionMessageReply = null;
    }),
  )
  .handleAction(actions.setFilesPreview, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.filesPreview = payload;
    }),
  )
  .handleAction(actions.clearFilesPreview, (state) =>
    produce(state, (nextState) => {
      nextState.filesPreview = null;
    }),
  );
