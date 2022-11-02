import { createSelector } from "reselect";
import { AppState } from "@/shared/interfaces/State";

const selectAuth = (state: AppState) => state.auth;

export const authentificated = () =>
  createSelector(selectAuth, (state) => state.authentificated);
export const selectUser = () =>
  createSelector(selectAuth, (state) => state.user);
export const selectUserRoles = () =>
  createSelector(selectUser(), (user) => user?.roles);
export const selectLoginModalState = () =>
  createSelector(selectAuth, (state) => state.loginModalState);
export const selectIsAuthLoading = () =>
  createSelector(selectAuth, (state) => state.isAuthLoading);
export const selectAuthProvider = () =>
  createSelector(selectAuth, (state) => state.authProvider);
export const selectUserPhoneNumber = () =>
  createSelector(selectAuth, (state) => state.userPhoneNumber);
