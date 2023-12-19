import { getChatChannelUserStatusKey } from "@/shared/constants";
import { getFeedItemUserMetadataKey } from "@/shared/constants/getFeedItemUserMetadataKey";
import { AppState } from "@/shared/interfaces";

export const selectUserStateById = (userId: string) => (state: AppState) =>
  state.cache.userStates[userId] || null;

export const selectGovernanceStateByCommonId =
  (commonId: string) => (state: AppState) =>
    state.cache.governanceByCommonIdStates[commonId] || null;

export const selectDiscussionStateById =
  (discussionId: string) => (state: AppState) =>
    state.cache.discussionStates[discussionId] || null;

export const selectDiscussionStates = () => (state: AppState) =>
  state.cache.discussionStates;

export const selectProposalStates = () => (state: AppState) =>
  state.cache.proposalStates;

export const selectProposalStateById =
  (proposalId: string) => (state: AppState) =>
    state.cache.proposalStates[proposalId] || null;

export const selectDiscussionMessagesStateByDiscussionId =
  (discussionId: string) => (state: AppState) =>
    state.cache.discussionMessagesStates[discussionId] || null;

export const selectFeedStateByCommonId =
  (commonId: string) => (state: AppState) =>
    state.cache.feedByCommonIdStates[commonId] || null;

export const selectFeedItemUserMetadata =
  (info: { commonId: string; userId: string; feedObjectId: string }) =>
  (state: AppState) =>
    state.cache.feedItemUserMetadataStates[getFeedItemUserMetadataKey(info)] ||
    null;

export const selectChatChannelUserStatus =
  (info: { userId: string; chatChannelId: string }) => (state: AppState) =>
    state.cache.chatChannelUserStatusStates[
      getChatChannelUserStatusKey(info)
    ] || null;
