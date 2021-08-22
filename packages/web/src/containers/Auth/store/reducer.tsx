import { produce } from "immer";
import { ActionType, createReducer } from "typesafe-actions";

import { AuthStateType } from "../interface";
// import { tokenHandler } from "../../../shared/utils";
import * as actions from "./actions";

type Action = ActionType<typeof actions>;

const initialState: AuthStateType = {
  authentificated: !localStorage.getItem("token") ? false : true, // TODO: maybe need a better way to check this
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "") : false,
  isNewUser: true,
};

const reducer = createReducer<AuthStateType, Action>(initialState)
  .handleAction(actions.socialLogin.success, (state, action) =>
    produce(state, (nextState) => {
      nextState.authentificated = true;
      nextState.user = action.payload;
    }),
  )
  .handleAction(actions.updateUserDetails.success, (state, action) =>
    produce(state, (nextState) => {
      nextState.user = action.payload;
    }),
  )
  .handleAction(actions.logOut, (state) =>
    produce(state, (nextState) => {
      nextState.authentificated = false;
      nextState.user = null;
    }),
  )
  .handleAction(actions.setIsUserNew, (state, action) =>
    produce(state, (nextState) => {
      nextState.isNewUser = action.payload;
    }),
  );

export { reducer as AuthReducer };
