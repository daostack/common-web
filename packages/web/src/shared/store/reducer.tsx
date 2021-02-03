import produce from "immer";
import { ActionType, createReducer } from "typesafe-actions";
import { SharedStateType } from "../interfaces";
import * as actions from "./actions";

type Action = ActionType<typeof actions>;

const initialState: SharedStateType = {
  loading: false,
  notification: null,
};

const reducer = createReducer<SharedStateType, Action>(initialState)
  .handleAction(actions.startLoading, (state) =>
    produce(state, (nextState) => {
      nextState.loading = true;
    }),
  )
  .handleAction(actions.stopLoading, (state) =>
    produce(state, (nextState) => {
      nextState.loading = false;
    }),
  )
  .handleAction(actions.showNotification, (state, action) =>
    produce(state, (nexState) => {
      nexState.notification = action.payload;
    }),
  );
export { reducer as SharedReducer };
