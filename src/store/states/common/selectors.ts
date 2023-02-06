import { AppState } from "@/shared/interfaces";

export const selectCommonAction = (state: AppState) =>
  state.common.commonAction;

export const selectDiscussionCreationData = (state: AppState) =>
  state.common.discussionCreation.data;

export const selectIsDiscussionCreationLoading = (state: AppState) =>
  state.common.discussionCreation.loading;

export const selectProposalCreationData = (state: AppState) =>
    state.common.proposalCreation.data;

export const selectIsProposalCreationLoading = (state: AppState) =>
  state.common.proposalCreation.loading;

export const selectFeedItems = (state: AppState) => state.common.feedItems;
