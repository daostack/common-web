import { createSelector } from "reselect";

import { AppState } from "../interfaces";

const selectShared = (state: AppState) => state.shared;

export const getLoading = () => createSelector(selectShared, (state) => state.loading);

export const getNotification = () => createSelector(selectShared, (state) => state.notification);

export const selectRouter = () =>
  createSelector(
    (state: AppState) => state,
    (state) => state,
  );
