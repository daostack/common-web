import { AppState } from "@/shared/interfaces";

export const selectCommonState = (state: AppState) => state.common;

export const selectCommonAction = (state: AppState) =>
  state.common.commonAction;

export const selectCommonMember = (state: AppState) =>
  state.common.commonMember;

export const selectGovernance = (state: AppState) => state.common.governance;

export const selectDiscussionCreationData = (state: AppState) =>
  state.common.discussionCreation.data;

export const selectIsDiscussionCreationLoading = (state: AppState) =>
  state.common.discussionCreation.loading;

export const selectProposalCreationData = (state: AppState) =>
  state.common.proposalCreation.data;

export const selectIsProposalCreationLoading = (state: AppState) =>
  state.common.proposalCreation.loading;

export const selectFeedItems = (state: AppState) => state.common.feedItems;

export const selectPinnedFeedItems = (state: AppState) =>
  state.common.pinnedFeedItems;

export const selectIsNewProjectCreated = (state: AppState) =>
  state.common.isNewProjectCreated;

export const selectSharedFeedItem = (state: AppState) =>
  state.common.sharedFeedItem;

export const selectRecentStreamId = (state: AppState) =>
  state.common.recentStreamId;

export const selectRecentAssignedCircle = (state: AppState) =>
  state.common.recentAssignedCircle;
