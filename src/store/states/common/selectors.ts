import { AppState } from "@/shared/interfaces";

export const selectCommonState = (state: AppState) => state.common;

export const selectCommonAction = (commonId: string) => (state: AppState) =>
  state.common.commonActions[commonId] || null;

export const selectCommonMember = (commonId: string) => (state: AppState) =>
  state.common.commonMembers[commonId] || {};

export const selectGovernance = (commonId: string) => (state: AppState) =>
  state.common.governance[commonId] || {};

export const selectDiscussionCreationData =
  (commonId: string) => (state: AppState) =>
    state.common.discussionCreations[commonId]?.data || null;

export const selectIsDiscussionCreationLoading =
  (commonId: string) => (state: AppState) =>
    state.common.discussionCreations[commonId]?.loading || false;

export const selectProposalCreationData =
  (commonId: string) => (state: AppState) =>
    state.common.proposalCreations[commonId]?.data || null;

export const selectIsProposalCreationLoading =
  (commonId: string) => (state: AppState) =>
    state.common.proposalCreations[commonId]?.loading || false;

export const selectFeedItems = (commonId: string) => (state: AppState) =>
  state.common.feedItems[commonId] || {
    data: null,
    loading: false,
    hasMore: false,
    firstDocTimestamp: null,
    lastDocTimestamp: null,
    batchNumber: 0,
  };

export const selectPinnedFeedItems =
  (commonId: string) => (state: AppState) => {
    const pinnedFeedItems = state.common.pinnedFeedItems[commonId];
    return {
      data: pinnedFeedItems?.data || [],
      loading: pinnedFeedItems?.loading || false,
    };
  };

export const selectFilteredFeedItems =
  (commonId: string) => (state: AppState) =>
    state.common.searchState[commonId]?.feedItems || null;

export const selectFilteredPinnedFeedItems =
  (commonId: string) => (state: AppState) =>
    state.common.searchState?.[commonId]?.pinnedFeedItems ?? null;

export const selectFeedSearchValue = (commonId: string) => (state: AppState) =>
  state.common.searchState[commonId]?.searchValue || "";

export const selectIsSearchingFeedItems =
  (commonId: string) => (state: AppState) =>
    state.common.searchState[commonId]?.isSearching || false;

export const selectIsNewProjectCreated =
  (commonId: string) => (state: AppState) =>
    state.common.isNewProjectCreated[commonId] || {};

export const selectSharedFeedItem = (commonId: string) => (state: AppState) =>
  state.common.sharedFeedItem[commonId] || null;

export const selectRecentStreamId = (state: AppState) =>
  state.common.recentStreamId || "";

export const selectRecentAssignedCircle =
  (commonId: string, memberId: string) => (state: AppState) =>
    state.common.recentAssignedCircleByMember[commonId]?.[memberId] || {};
