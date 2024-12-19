import { createSelector } from "reselect";
import {
  getChatChannelUserStatusKey,
  getCommonMemberStateKey,
} from "@/shared/constants";
import { getFeedItemUserMetadataKey } from "@/shared/constants/getFeedItemUserMetadataKey";
import { AppState } from "@/shared/interfaces";

// Base selector to access cache state
const selectCacheState = (state: AppState) => state.cache;

// User States
export const selectUserStates = createSelector(
  selectCacheState,
  (cache) => cache.userStates
);

export const selectUserStateById = (userId: string) =>
  createSelector(selectUserStates, (userStates) => userStates[userId] || null);

// Governance States
export const selectGovernanceStateByCommonId = (commonId: string) =>
  createSelector(
    selectCacheState,
    (cache) => cache.governanceByCommonIdStates[commonId] || null
  );

// Discussion States
export const selectDiscussionStates = createSelector(
  selectCacheState,
  (cache) => cache.discussionStates
);

export const selectDiscussionStateById = (discussionId: string) =>
  createSelector(
    selectDiscussionStates,
    (discussionStates) => discussionStates[discussionId] || null
  );

// Proposal States
export const selectProposalStates = createSelector(
  selectCacheState,
  (cache) => cache.proposalStates
);

export const selectProposalStateById = (proposalId: string) =>
  createSelector(
    selectProposalStates,
    (proposalStates) => proposalStates[proposalId] || null
  );

// Discussion Messages
export const selectDiscussionMessagesStateByDiscussionId = (discussionId: string) =>
  createSelector(
    selectCacheState,
    (cache) => cache.discussionMessagesStates[discussionId] || null
  );

// Chat Channel Messages
export const selectChatChannelMessagesStateByChatChannelId = (chatChannelId: string) =>
  createSelector(
    selectCacheState,
    (cache) => cache.chatChannelMessagesStates[chatChannelId] || null
  );

// Common Members
export const selectCommonMembersStateByCommonId = (commonId?: string) =>
  createSelector(
    selectCacheState,
    (cache) => (commonId ? cache.commonMembersState[commonId] || null : null)
  );

// Feed States
export const selectFeedStateByCommonId = (commonId: string) =>
  createSelector(
    selectCacheState,
    (cache) => cache.feedByCommonIdStates[commonId] || null
  );

// Feed Item User Metadata States
export const selectFeedItemUserMetadataStates = createSelector(
  selectCacheState,
  (cache) => cache.feedItemUserMetadataStates
);

export const selectFeedItemUserMetadata = (info: { commonId: string; userId: string; feedObjectId: string }) =>
  createSelector(
    selectFeedItemUserMetadataStates,
    (metadataStates) => metadataStates[getFeedItemUserMetadataKey(info)] || null
  );

// Chat Channel User Status States
export const selectChatChannelUserStatusStates = createSelector(
  selectCacheState,
  (cache) => cache.chatChannelUserStatusStates
);

export const selectChatChannelUserStatus = (info: { userId: string; chatChannelId: string }) =>
  createSelector(
    selectChatChannelUserStatusStates,
    (statusStates) => statusStates[getChatChannelUserStatusKey(info)] || null
  );

// Common Member State by User and Common IDs
export const selectCommonMemberStateByUserAndCommonIds = (info: { userId: string; commonId: string }) =>
  createSelector(
    selectCacheState,
    (cache) => cache.commonMemberByUserAndCommonIdsStates[getCommonMemberStateKey(info)] || null
  );

// External Common Users
export const selectExternalCommonUsers = createSelector(
  selectCacheState,
  (cache) => cache.externalCommonUsers
);
