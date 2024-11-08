import { produce } from "immer";
import { ActionType, createReducer } from "typesafe-actions";
import { AuthStateType } from "../interface";
import * as actions from "./actions";

type Action = ActionType<typeof actions>;

const initialState: AuthStateType = {
  isAuthenticated: Boolean(localStorage.getItem("token")),
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "")
    : false,
  userPhoneNumber: null,
  loginModalState: { isShowing: false },
  isAuthLoading: false,
  authProvider: null,
  isAuthenticationReady: false,
  userStreamsWithNotificationsAmount: null,
};

const reducer = createReducer<AuthStateType, Action>(initialState)
  .handleAction(
    [
      actions.socialLogin.success,
      actions.loginWithFirebaseUser.success,
      actions.loginUsingEmailAndPassword.success,
      actions.confirmVerificationCode.success,
      actions.webviewLogin.success,
      actions.webviewLoginWithUser.success,
    ],
    (state, action) =>
      produce(state, (nextState) => {
        nextState.isAuthenticated = true;
        nextState.user = action.payload;
        nextState.userStreamsWithNotificationsAmount =
          action.payload.inboxCounter ?? null;
      }),
  )
  .handleAction(actions.logOut, (state) =>
    produce(state, (nextState) => {
      nextState.isAuthenticated = false;
      nextState.user = null;
      nextState.userPhoneNumber = null;
      nextState.userStreamsWithNotificationsAmount = null;
      nextState.isAuthLoading = false;
      nextState.authProvider = null;
    }),
  )
  .handleAction(actions.setLoginModalState, (state, action) =>
    produce(state, (nextState) => {
      nextState.loginModalState = action.payload;
    }),
  )
  .handleAction(actions.startAuthLoading, (state) =>
    produce(state, (nextState) => {
      nextState.isAuthLoading = true;
    }),
  )
  .handleAction(actions.stopAuthLoading, (state) =>
    produce(state, (nextState) => {
      nextState.isAuthLoading = false;
    }),
  )
  .handleAction(actions.setAuthProvider, (state, action) =>
    produce(state, (nextState) => {
      nextState.authProvider = action.payload;
    }),
  )
  .handleAction(actions.setUserPhoneNumber, (state, action) =>
    produce(state, (nextState) => {
      nextState.userPhoneNumber = action.payload;
    }),
  )
  .handleAction(actions.setIsAuthenticationReady, (state, action) =>
    produce(state, (nextState) => {
      nextState.isAuthenticationReady = action.payload;
    }),
  )
  .handleAction(
    actions.setUserStreamsWithNotificationsAmount,
    (state, action) =>
      produce(state, (nextState) => {
        nextState.userStreamsWithNotificationsAmount = action.payload;
      }),
  );

export { reducer as AuthReducer };
