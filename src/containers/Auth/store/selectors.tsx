import { createSelector } from "reselect";

import { AppState } from "../../../shared/interfaces/State";

const selectAuth = (state: AppState) => state.auth;

export const authentificated = () =>
  createSelector(selectAuth, (state) => state.authentificated);
export const selectUser = () =>
  createSelector(selectAuth, (state) => state.user);
export const selectIsNewUser = () =>
  createSelector(selectAuth, (state) => state.isNewUser);
export const selectIsLoginModalShowing = () =>
  createSelector(selectAuth, (state) => state.isLoginModalShowing);
