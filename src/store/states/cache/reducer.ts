import produce from "immer";
import { ActionType, createReducer } from "typesafe-actions";
import { getFeedItemUserMetadataKey } from "@/shared/constants/getFeedItemUserMetadataKey";
import * as actions from "./actions";
import { CacheState } from "./types";
import { unionWith } from "lodash";

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
        const { discussionId } = payload;

      const newState = unionWith(payload.state?.data ?? [],state.discussionMessagesStates[discussionId]?.data ?? [] , (prevMsg, nextMsg) => {
        return prevMsg.id === nextMsg.id;
      })

        nextState.discussionMessagesStates[discussionId] = { ...payload.state, data: newState };
      }),
  )
  .handleAction(actions.updateDiscussionMessageWithActualId, (state, { payload }) =>
  produce(state, (nextState) => {
    const { pendingMessageId, actualId, discussionId } = payload;
    const newState = {...state.discussionMessagesStates[discussionId]};
    const indexOfPendingMessage = newState.data?.findIndex(({id}) => id === pendingMessageId) ?? 0;
    const updatedDate = (newState.data ?? []).map((item, index) => {
      if(index === indexOfPendingMessage) {
        return {...item, id:actualId}
      }

      return item;
      
    });
    nextState.discussionMessagesStates[discussionId] = { ...newState, data: updatedDate };
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
