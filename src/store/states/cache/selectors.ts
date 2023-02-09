import { getFeedItemUserMetadataKey } from "@/shared/constants/getFeedItemUserMetadataKey";
import { AppState } from "@/shared/interfaces";

export const selectUserStateById = (userId: string) => (state: AppState) =>
  state.cache.userStates[userId] || null;

export const selectDiscussionStateById =
  (discussionId: string) => (state: AppState) =>
    state.cache.discussionStates[discussionId] || null;

export const selectProposalStateById =
  (proposalId: string) => (state: AppState) =>
    state.cache.proposalStates[proposalId] || null;

export const selectDiscussionMessagesStateByDiscussionId =
  (discussionId: string) => (state: AppState) =>
    state.cache.discussionMessagesStates[discussionId] || null;

export const selectFeedItemUserMetadata =
  (info: { commonId: string; userId: string; feedObjectId: string }) =>
  (state: AppState) =>
    state.cache.feedItemUserMetadataStates[getFeedItemUserMetadataKey(info)] ||
    null;
