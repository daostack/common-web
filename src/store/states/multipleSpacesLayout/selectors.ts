import { createSelector } from "reselect";
import { AppState } from "@/shared/interfaces";

// Base Selector for multipleSpacesLayout state
const selectMultipleSpacesLayoutState = (state: AppState) =>
  state.multipleSpacesLayout;

// Breadcrumbs
export const selectMultipleSpacesLayoutBreadcrumbs = createSelector(
  selectMultipleSpacesLayoutState,
  (layout) => layout.breadcrumbs
);

// Back URL
export const selectMultipleSpacesLayoutBackUrl = createSelector(
  selectMultipleSpacesLayoutState,
  (layout) => layout.backUrl
);

// Main Width
export const selectMultipleSpacesLayoutMainWidth = createSelector(
  selectMultipleSpacesLayoutState,
  (layout) => layout.mainWidth
);
