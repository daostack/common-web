import { createSelector } from "reselect";
import { AppState } from "@/shared/interfaces";

// Base selector to get the common state
export const selectCommonState = (state: AppState) => state.common;

// Common Action
export const selectCommonAction = createSelector(
  selectCommonState,
  (common) => common.commonAction || null
);

// Common Member
export const selectCommonMember = (commonId: string) =>
  createSelector(
    selectCommonState,
    (common) => common.commonMembers[commonId] || {}
  );

// Governance
export const selectGovernance = (commonId: string) =>
  createSelector(
    selectCommonState,
    (common) => common.governance[commonId] || {}
  );

// Discussion Creation
export const selectDiscussionCreationData = (commonId: string) =>
  createSelector(
    selectCommonState,
    (common) => common.discussionCreations[commonId]?.data || null
  );

export const selectIsDiscussionCreationLoading = (commonId: string) =>
  createSelector(
    selectCommonState,
    (common) => common.discussionCreations[commonId]?.loading || false
  );

// Proposal Creation
export const selectProposalCreationData = (commonId: string) =>
  createSelector(
    selectCommonState,
    (common) => common.proposalCreations[commonId]?.data || null
  );

export const selectIsProposalCreationLoading = (commonId: string) =>
  createSelector(
    selectCommonState,
    (common) => common.proposalCreations[commonId]?.loading || false
  );

// Feed Items
export const selectFeedItems = (commonId: string) =>
  createSelector(
    selectCommonState,
    (common) =>
      common.feedItems[commonId] || {
        data: null,
        loading: false,
        hasMore: false,
        firstDocTimestamp: null,
        lastDocTimestamp: null,
        batchNumber: 0,
      }
  );

// Pinned Feed Items
export const selectPinnedFeedItems = (commonId: string) =>
  createSelector(
    selectCommonState,
    (common) => {
      const pinnedFeedItems = common.pinnedFeedItems[commonId];
      return {
        data: pinnedFeedItems?.data || [],
        loading: pinnedFeedItems?.loading || false,
      };
    }
  );

// Filtered Feed Items
export const selectFilteredFeedItems = (commonId: string) =>
  createSelector(
    selectCommonState,
    (common) => common.searchState[commonId]?.feedItems || null
  );

// Filtered Pinned Feed Items
export const selectFilteredPinnedFeedItems = (commonId: string) =>
  createSelector(
    selectCommonState,
    (common) => common.searchState?.[commonId]?.pinnedFeedItems ?? null
  );

// Feed Search Value
export const selectFeedSearchValue = (commonId: string) =>
  createSelector(
    selectCommonState,
    (common) => common.searchState[commonId]?.searchValue || ""
  );

// Is Searching Feed Items
export const selectIsSearchingFeedItems = (commonId: string) =>
  createSelector(
    selectCommonState,
    (common) => common.searchState[commonId]?.isSearching || false
  );

// Is New Project Created
export const selectIsNewProjectCreated = (commonId: string) =>
  createSelector(
    selectCommonState,
    (common) => common.isNewProjectCreated[commonId] || {}
  );

// Shared Feed Item
export const selectSharedFeedItem = (commonId: string) =>
  createSelector(
    selectCommonState,
    (common) => common.sharedFeedItem[commonId] || null
  );

// Recent Stream ID
export const selectRecentStreamId = createSelector(
  selectCommonState,
  (common) => common.recentStreamId || ""
);

export const selectPendingFeedItemId = createSelector(
  selectCommonState,
  (common) => common.pendingFeedItemId || ""
);

// Recent Assigned Circle
export const selectRecentAssignedCircle = (commonId: string, memberId: string) =>
  createSelector(
    selectCommonState,
    (common) => common.recentAssignedCircleByMember[commonId]?.[memberId] || {}
  );
