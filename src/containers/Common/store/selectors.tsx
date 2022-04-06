import { createSelector } from "reselect";
import { AppState } from "../../../shared/interfaces";

const selectCommons = (state: AppState) => state.commons;

export const selectCommonList = () =>
  createSelector(selectCommons, (state) => state.commons);
export const selectCommonDetail = () =>
  createSelector(selectCommons, (state) => state.common);
export const selectCurrentPage = () =>
  createSelector(selectCommons, (state) => state.page);
export const selectProposals = () =>
  createSelector(selectCommons, (state) => state.proposals);
export const selectDiscussions = () =>
  createSelector(selectCommons, (state) => state.discussions);
export const selectCards = () =>
  createSelector(selectCommons, (state) => state.cards);
export const selectIsDiscussionsLoaded = () =>
  createSelector(selectCommons, (state) => state.isDiscussionsLoaded);
export const selectCurrentDisscussion = () =>
  createSelector(selectCommons, (state) => state.currentDiscussion);
export const selectIsProposalLoaded = () =>
  createSelector(selectCommons, (state) => state.isProposalsLoaded);
export const selectCurrentProposal = () =>
  createSelector(selectCommons, (state) => state.currentProposal);
export const selectUserProposalList = () =>
  createSelector(selectCommons, (state) => state.userProposals);
