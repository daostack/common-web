import produce from "immer";
import { ActionType, createReducer } from "typesafe-actions";
import * as actions from "./actions";
import { CacheState } from "./types";

type Action = ActionType<typeof actions>;

const initialState: CacheState = {
  userStates: {},
};

export const reducer = createReducer<CacheState, Action>(
  initialState,
).handleAction(actions.updateUserStateById, (state, { payload }) =>
  produce(state, (nextState) => {
    const { userId, state } = payload;

    nextState.userStates[userId] = { ...state };
  }),
);
