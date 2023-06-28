import { AppState } from "@/shared/interfaces";

export const selectMultipleSpacesLayoutBreadcrumbs = (state: AppState) =>
  state.multipleSpacesLayout.breadcrumbs;

export const selectMultipleSpacesLayoutPreviousBreadcrumbs = (
  state: AppState,
) => state.multipleSpacesLayout.previousBreadcrumbs;
