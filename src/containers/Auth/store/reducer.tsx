import { produce } from "immer";
import { ActionType, createReducer } from "typesafe-actions";

import { AuthStateType } from "../interface";
import * as actions from "./actions";

type Action = ActionType<typeof actions>;

const initialState: AuthStateType = {
  authentificated: !!localStorage.getItem("token"),
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "")
    : false,
  userPhoneNumber: null,
  loginModalState: { isShowing: false },
  isAuthLoading: false,
  authProvider: null,
  isAuthenticationReady: false,
};

const reducer = createReducer<AuthStateType, Action>(initialState)
  .handleAction(
    [
      actions.socialLogin.success,
      actions.loginUsingEmailAndPassword.success,
      actions.confirmVerificationCode.success,
      actions.webviewLogin.success
    ],
    (state, action) =>
      produce(state, (nextState) => {
        nextState.authentificated = true;
        nextState.user = action.payload;
      })
  )
  .handleAction(actions.logOut, (state) =>
    produce(state, (nextState) => {
      nextState.authentificated = false;
      nextState.user = null;
    })
  )
  .handleAction(actions.setLoginModalState, (state, action) =>
    produce(state, (nextState) => {
      nextState.loginModalState = action.payload;
    })
  )
  .handleAction(actions.startAuthLoading, (state, action) =>
    produce(state, (nextState) => {
      nextState.isAuthLoading = true;
    })
  )
  .handleAction(actions.stopAuthLoading, (state, action) =>
    produce(state, (nextState) => {
      nextState.isAuthLoading = false;
    })
  )
  .handleAction(actions.setAuthProvider, (state, action) =>
    produce(state, (nextState) => {
      nextState.authProvider = action.payload;
    })
  )
  .handleAction(actions.setUserPhoneNumber, (state, action) =>
    produce(state, (nextState) => {
      nextState.userPhoneNumber = action.payload;
    })
  )
  .handleAction(actions.setIsAuthenticationReady, (state, action) =>
    produce(state, (nextState) => {
      nextState.isAuthenticationReady = action.payload;
    })
  );

export { reducer as AuthReducer };
