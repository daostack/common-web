import { createSelector } from "reselect";
import { AppState } from "@/shared/interfaces/State";

const selectAuth = (state: AppState) => state.auth;

export const selectIsAuthenticated = () =>
  createSelector(selectAuth, (state) => state.isAuthenticated);
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
export const selectUserStreamsWithNotificationsAmount = () =>
  createSelector(
    selectAuth,
    (state) => state.userStreamsWithNotificationsAmount,
  );
