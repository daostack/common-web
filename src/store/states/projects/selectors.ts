import { AppState } from "@/shared/interfaces";

export const selectProjectsData = (state: AppState) => state.projects.data;

export const selectAreProjectsLoading = (state: AppState) =>
  state.projects.isDataLoading;

export const selectAreProjectsFetched = (state: AppState) =>
  state.projects.isDataFetched;

export const selectIsCommonCreationDisabled = (state: AppState) =>
  state.projects.isCommonCreationDisabled;
