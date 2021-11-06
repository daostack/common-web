import { createSelector } from "reselect";

import { AppState } from "../../../shared/interfaces";

const selectAuth = (state: AppState) => state.auth;

export const authentificated = () => createSelector(selectAuth, (state) => state.authentificated);
export const selectUser = () => createSelector(selectAuth, (state) => state.user);
export const selectIsNewUser = () => createSelector(selectAuth, (state) => state.isNewUser);
