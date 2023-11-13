import produce from "immer";
import { ActionType, createReducer } from "typesafe-actions";
import { getChatChannelUserStatusKey } from "@/shared/constants";
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
  feedByCommonIdStates: {},
  feedItemUserMetadataStates: {},
  chatChannelUserStatusStates: {},
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

        nextState.discussionMessagesStates[discussionId] = {
          ...payload.state,
          data: payload.state.data,
        };
      }),
  )
  .handleAction(
    actions.addDiscussionMessageByDiscussionId,
    (state, { payload }) =>
      produce(state, (nextState) => {
        const { discussionId, discussionMessage } = payload;

        const updatedDiscussionMessages = [
          ...(state.discussionMessagesStates[discussionId]?.data ?? []),
          discussionMessage,
        ];

        nextState.discussionMessagesStates[discussionId] = {
          ...state.discussionMessagesStates[discussionId],
          data: updatedDiscussionMessages,
        };
      }),
  )
  .handleAction(
    actions.updateDiscussionMessageWithActualId,
    (state, { payload }) =>
      produce(state, (nextState) => {
        const { pendingMessageId, actualId, discussionId } = payload;
        const newState = { ...state.discussionMessagesStates[discussionId] };
        const indexOfPendingMessage =
          newState.data?.findIndex(({ id }) => id === pendingMessageId) ?? 0;
        const updatedDate = (newState.data ?? []).map((item, index) => {
          if (index === indexOfPendingMessage) {
            return { ...item, id: actualId };
          }

          return item;
        });
        nextState.discussionMessagesStates[discussionId] = {
          data: updatedDate,
          loading: false,
          fetched: true,
        };
      }),
  )
  .handleAction(actions.updateProposalStateById, (state, { payload }) =>
    produce(state, (nextState) => {
      const { proposalId, state } = payload;

      nextState.proposalStates[proposalId] = { ...state };
    }),
  )
  .handleAction(actions.updateFeedStateByCommonId, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId, state } = payload;

      nextState.feedByCommonIdStates[commonId] = { ...state };
    }),
  )
  .handleAction(actions.resetFeedStates, (state) =>
    produce(state, (nextState) => {
      nextState.feedByCommonIdStates = {};
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
  )
  .handleAction(actions.updateChatChannelUserStatus, (state, { payload }) =>
    produce(state, (nextState) => {
      const { userId, chatChannelId, state } = payload;

      nextState.chatChannelUserStatusStates[
        getChatChannelUserStatusKey({
          userId,
          chatChannelId,
        })
      ] = { ...state };
    }),
  );
