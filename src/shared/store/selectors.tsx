import { createSelector } from "reselect";

import { AppState } from "../interfaces";

const selectShared = (state: AppState) => state.shared;
const selectScreenSize = (state: AppState) => state.shared;

export const getLoading = () => createSelector(selectShared, (state) => state.loading);

export const getNotification = () => createSelector(selectShared, (state) => state.notification);

export const getScreenSize = () => createSelector(selectScreenSize, (state) => state.screenSize);

export const selectRouter = () =>
  createSelector(
    (state: AppState) => state,
    (state) => state,
  );

export const selectShareLinks = () =>
  createSelector(selectShared, (state) => state.shareLinks);

export const selectLoadingShareLinks = () =>
  createSelector(selectShared, (state) => state.loadingShareLinks);

export const selectAreReportsLoading = () =>
  createSelector(selectShared, (state) => state.areReportsLoading);

export const selectHeader = () =>
  createSelector(selectShared, (state) => state.header);

export const selectFooter = () =>
  createSelector(selectShared, (state) => state.footer);

export const selectLanguage = () =>
  createSelector(selectShared, (state) => state.language);

export const selectIsRtlLanguage = () =>
  createSelector(selectShared, (state) => state.isRtlLanguage);
