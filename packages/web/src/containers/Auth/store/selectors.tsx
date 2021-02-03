import { createSelector } from "reselect";

import { AppState } from "../../../shared/interfaces/State";

const selectAuth = (state: AppState) => state.auth;

export const authentificated = () => createSelector(selectAuth, (state) => state.authentificated);
