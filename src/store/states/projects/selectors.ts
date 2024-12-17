import { createSelector } from "reselect";
import { AppState } from "@/shared/interfaces";

// Base selector for projects state
const selectProjectsState = (state: AppState) => state.projects;

// Projects Data
export const selectProjectsData = createSelector(
  selectProjectsState,
  (projects) => projects.data
);

// Are Projects Loading
export const selectAreProjectsLoading = createSelector(
  selectProjectsState,
  (projects) => projects.isDataLoading
);

// Are Projects Fetched
export const selectAreProjectsFetched = createSelector(
  selectProjectsState,
  (projects) => projects.isDataFetched
);

// Is Common Creation Disabled
export const selectIsCommonCreationDisabled = createSelector(
  selectProjectsState,
  (projects) => projects.isCommonCreationDisabled
);
