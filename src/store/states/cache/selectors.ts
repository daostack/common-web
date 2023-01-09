import { AppState } from "@/shared/interfaces";

export const selectUserStateById = (userId: string) => (state: AppState) =>
  state.cache.userStates[userId] || null;

export const selectDiscussionStateById =
  (discussionId: string) => (state: AppState) =>
    state.cache.discussionStates[discussionId] || null;

export const selectProposalStateById =
  (proposalId: string) => (state: AppState) =>
    state.cache.proposalStates[proposalId] || null;
