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

export const selectFilteredFeedItems = (state: AppState) =>
  state.common.searchState.feedItems;

export const selectFilteredPinnedFeedItems = (state: AppState) =>
  state.common.searchState.pinnedFeedItems;

export const selectFeedSearchValue = (state: AppState) =>
  state.common.searchState.searchValue;

export const selectIsSearchingFeedItems = (state: AppState) =>
  state.common.searchState.isSearching;

export const selectIsNewProjectCreated = (state: AppState) =>
  state.common.isNewProjectCreated;

export const selectSharedFeedItem = (state: AppState) =>
  state.common.sharedFeedItem;

export const selectRecentStreamId = (state: AppState) =>
  state.common.recentStreamId;

export const selectOptimisticFeedItems = (state: AppState) =>
  state.common.optimisticFeedItems;

export const selectOptimisticDiscussionMessages = (state: AppState) =>
  state.common.optimisticDiscussionMessages;

export const selectCreatedOptimisticFeedItems = (state: AppState) =>
  state.common.createdOptimisticFeedItems;

export const selectRecentAssignedCircle =
  (memberId: string) => (state: AppState) =>
    state.common.recentAssignedCircleByMember[memberId];
