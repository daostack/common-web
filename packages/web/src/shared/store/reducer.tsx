import produce from "immer";
import { ActionType, createReducer } from "typesafe-actions";
import { ScreenSize, SMALL_SCREEN_BREAKPOINT } from "../../containers/App/constants";
import { SharedStateType } from "../interfaces";
import * as actions from "./actions";

type Action = ActionType<typeof actions>;

const initialState: SharedStateType = {
  loading: false,
  notification: null,
  screenSize: window.matchMedia(`(min-width: ${SMALL_SCREEN_BREAKPOINT})`).matches
    ? ScreenSize.Large
    : ScreenSize.Small,
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
  )
  .handleAction(actions.changeScreenSize, (state, action) =>
    produce(state, (nextState) => {
      nextState.screenSize = action.payload;
    }),
  );
export { reducer as SharedReducer };
