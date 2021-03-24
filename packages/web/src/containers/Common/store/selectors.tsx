import { createSelector } from "reselect";
import { AppState } from "../../../shared/interfaces";

const selectCommons = (state: AppState) => state.commons;

export const selectCommonList = createSelector(selectCommons, (state) => state.commons);
export const selectCommonDetail = createSelector(selectCommons, (state) => state.common);
export const selectCurrentPage = createSelector(selectCommons, (state) => state.page);
export const selectProposals = createSelector(selectCommons, (state) => state.proposals);
export const selectDiscussions = createSelector(selectCommons, (state) => state.discussions);
