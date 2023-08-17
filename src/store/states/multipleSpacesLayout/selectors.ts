import { AppState } from "@/shared/interfaces";

export const selectMultipleSpacesLayoutBreadcrumbs = (state: AppState) =>
  state.multipleSpacesLayout.breadcrumbs;

export const selectMultipleSpacesLayoutPreviousBreadcrumbs = (
  state: AppState,
) => state.multipleSpacesLayout.previousBreadcrumbs;

export const selectMultipleSpacesLayoutBackUrl = (state: AppState) =>
  state.multipleSpacesLayout.backUrl;

export const selectMultipleSpacesLayoutMainWidth = (state: AppState) =>
  state.multipleSpacesLayout.mainWidth;
