import produce from "immer";
import { ActionType, createReducer } from "typesafe-actions";
import { getFeedItemUserMetadataKey } from "@/shared/constants/getFeedItemUserMetadataKey";
import * as actions from "./actions";
import { CacheState } from "./types";

type Action = ActionType<typeof actions>;

const initialState: CacheState = {
  userStates: {},
  governanceByCommonIdStates: {},
  discussionStates: {},
  discussionMessagesStates: {},
  proposalStates: {},
  feedItemUserMetadataStates: {},
};

export const reducer = createReducer<CacheState, Action>(initialState)
  .handleAction(actions.updateUserStateById, (state, { payload }) =>
    produce(state, (nextState) => {
      const { userId, state } = payload;

      nextState.userStates[userId] = { ...state };
    }),
  )
  .handleAction(actions.updateGovernanceStateByCommonId, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId, state } = payload;

      nextState.governanceByCommonIdStates[commonId] = { ...state };
    }),
  )
  .handleAction(actions.updateDiscussionStateById, (state, { payload }) =>
    produce(state, (nextState) => {
      const { discussionId, state } = payload;

      nextState.discussionStates[discussionId] = { ...state };
    }),
  )
  .handleAction(
    actions.updateDiscussionMessagesStateByDiscussionId,
    (state, { payload }) =>
      produce(state, (nextState) => {
        const { discussionId, state } = payload;

        nextState.discussionMessagesStates[discussionId] = { ...state };
      }),
  )
  .handleAction(actions.updateProposalStateById, (state, { payload }) =>
    produce(state, (nextState) => {
      const { proposalId, state } = payload;

      nextState.proposalStates[proposalId] = { ...state };
    }),
  )
  .handleAction(actions.updateFeedItemUserMetadata, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId, userId, feedObjectId, state } = payload;

      nextState.feedItemUserMetadataStates[
        getFeedItemUserMetadataKey({
          commonId,
          userId,
          feedObjectId,
        })
      ] = { ...state };
    }),
  );
