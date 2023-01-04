import produce from "immer";
import { ActionType, createReducer } from "typesafe-actions";
import * as actions from "./actions";
import { CommonState } from "./types";

type Action = ActionType<typeof actions>;

const initialState: CommonState = {
  discussionCreationData: null,
};

export const reducer = createReducer<CommonState, Action>(initialState)
  .handleAction(actions.resetCommon, (state) =>
    produce(state, (nextState) => {
      nextState.discussionCreationData = null;
    }),
  )
  .handleAction(actions.setDiscussionCreationData, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.discussionCreationData = payload;
    }),
  );
