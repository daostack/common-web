import produce from "immer";
import { ActionType, createReducer } from "typesafe-actions";
import * as actions from "./actions";
import { CacheState } from "./types";

type Action = ActionType<typeof actions>;

const initialState: CacheState = {
  userStates: {},
  discussionStates: {},
  discussionMessagesStates: {},
  proposalStates: {},
};

export const reducer = createReducer<CacheState, Action>(initialState)
  .handleAction(actions.updateUserStateById, (state, { payload }) =>
    produce(state, (nextState) => {
      const { userId, state } = payload;

      nextState.userStates[userId] = { ...state };
    }),
  )
  .handleAction(actions.updateDiscussionStateById, (state, { payload }) =>
    produce(state, (nextState) => {
      const { discussionId, state } = payload;

      nextState.discussionStates[discussionId] = { ...state };
    }),
  )
  .handleAction(actions.updateDiscussionMessagesStateByDiscussionId, (state, { payload }) =>
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
  );
