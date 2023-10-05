import { createSelector } from "reselect";
import { AppState } from "@/shared/interfaces";

const selectCommonLayout = (state: AppState) => state.commonLayout;

export const selectCommonLayoutCommonId = (state: AppState) =>
  state.commonLayout.currentCommonId;

export const selectCommonLayoutLastCommonFromFeed = (state: AppState) =>
  state.commonLayout.lastCommonFromFeed;

export const selectCommonLayoutCommons = (state: AppState) =>
  state.commonLayout.commons;

export const selectAreCommonLayoutCommonsLoading = (state: AppState) =>
  state.commonLayout.areCommonsLoading;

export const selectAreCommonLayoutCommonsFetched = (state: AppState) =>
  state.commonLayout.areCommonsFetched;

export const selectCommonLayoutCommonsState = createSelector(
  selectCommonLayout,
  (state) => ({
    commons: state.commons,
    areCommonsLoading: state.areCommonsLoading,
    areCommonsFetched: state.areCommonsFetched,
  }),
);

export const selectCommonLayoutProjects = (state: AppState) =>
  state.commonLayout.projects;

export const selectAreCommonLayoutProjectsLoading = (state: AppState) =>
  state.commonLayout.areProjectsLoading;

export const selectAreCommonLayoutProjectsFetched = (state: AppState) =>
  state.commonLayout.areProjectsFetched;

export const selectCommonLayoutProjectsState = createSelector(
  selectCommonLayout,
  (state) => ({
    projects: state.projects,
    areProjectsLoading: state.areProjectsLoading,
    areProjectsFetched: state.areProjectsFetched,
  }),
);
