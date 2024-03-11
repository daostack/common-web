import produce from "immer";
import { unionBy, cloneDeep } from "lodash";
import { ActionType, createReducer } from "typesafe-actions";
import {
  getChatChannelUserStatusKey,
  getCommonMemberStateKey,
} from "@/shared/constants";
import { getFeedItemUserMetadataKey } from "@/shared/constants/getFeedItemUserMetadataKey";
import { checkIsUserDiscussionMessage } from "@/shared/models";
import * as actions from "./actions";
import { CacheState } from "./types";

type Action = ActionType<typeof actions>;

export const INITIAL_CACHE_STATE: CacheState = {
  userStates: {},
  governanceByCommonIdStates: {},
  discussionStates: {},
  discussionMessagesStates: {},
  proposalStates: {},
  feedByCommonIdStates: {},
  feedItemUserMetadataStates: {},
  chatChannelUserStatusStates: {},
  commonMembersState: {},
  commonMemberByUserAndCommonIdsStates: {},
  externalCommonUsers: [],
};

export const reducer = createReducer<CacheState, Action>(INITIAL_CACHE_STATE)
  .handleAction(actions.updateUserStateById, (state, { payload }) =>
    produce(state, (nextState) => {
      const { userId, state } = payload;

      nextState.userStates[userId] = { ...state };
    }),
  )
  .handleAction(actions.updateUserStates, (state, { payload }) =>
    produce(state, (nextState) => {
      payload.forEach((user) => {
        if (!user) {
          return;
        }

        nextState.userStates[user.uid] = {
          data: user,
          loading: false,
          fetched: true,
        };
      });
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
  .handleAction(actions.updateDiscussionStates, (state, { payload }) =>
    produce(state, (nextState) => {
      payload.forEach((discussion) => {
        if (!discussion) {
          return;
        }

        nextState.discussionStates[discussion.id] = {
          data: discussion,
          loading: false,
          fetched: true,
        };
      });
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
  .handleAction(actions.updateProposalStates, (state, { payload }) =>
    produce(state, (nextState) => {
      payload.forEach((proposal) => {
        if (!proposal) {
          return;
        }

        nextState.proposalStates[proposal.id] = {
          data: proposal,
          loading: false,
          fetched: true,
        };
      });
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
  .handleAction(
    actions.clearFeedStateByCommonId,
    (state, { payload: commonId }) =>
      produce(state, (nextState) => {
        delete nextState.feedByCommonIdStates[commonId];
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
      const key = getFeedItemUserMetadataKey({
        commonId,
        userId,
        feedObjectId,
      });
      const currentState = nextState.feedItemUserMetadataStates[key];

      if (state.data !== null && currentState?.data?.isSeenUpdating) {
        state.data.seen = currentState.data.seen;
      }

      nextState.feedItemUserMetadataStates[key] = { ...state };
    }),
  )
  .handleAction(actions.updateFeedItemUserSeenState, (state, { payload }) =>
    produce(state, (nextState) => {
      const { key, seen, isSeenUpdating } = payload;
      const state = nextState.feedItemUserMetadataStates[key]?.data;

      if (state) {
        state.seen = seen;
        state.seenOnce = true;
        state.count = 0;
        state.isSeenUpdating = isSeenUpdating;
      }
    }),
  )
  .handleAction(actions.updateChatChannelUserStatus, (state, { payload }) =>
    produce(state, (nextState) => {
      const { userId, chatChannelId, state } = payload;
      const key = getChatChannelUserStatusKey({
        userId,
        chatChannelId,
      });
      const currentState = nextState.chatChannelUserStatusStates[key];

      if (state.data !== null && currentState?.data?.isSeenUpdating) {
        state.data.seen = currentState.data.seen;
      }

      nextState.chatChannelUserStatusStates[key] = { ...state };
    }),
  )
  .handleAction(actions.updateChatChannelUserSeenState, (state, { payload }) =>
    produce(state, (nextState) => {
      const { key, seen, isSeenUpdating } = payload;
      const state = nextState.chatChannelUserStatusStates[key]?.data;

      if (state) {
        state.seen = seen;
        state.seenOnce = true;
        state.notSeenCount = 0;
        state.isSeenUpdating = isSeenUpdating;
      }
    }),
  )
  .handleAction(
    actions.updateDiscussionMessagesStateByDiscussionId,
    (state, { payload }) =>
      produce(state, (nextState) => {
        const {
          discussionId,
          updatedDiscussionMessages,
          removedDiscussionMessages,
        } = payload;

        const discussionMessages =
          state.discussionMessagesStates[discussionId]?.data ?? [];
        const removedDiscussionMessageIds = removedDiscussionMessages.map(
          ({ id }) => id,
        );

        const uniq = unionBy(
          updatedDiscussionMessages ?? [],
          discussionMessages.filter(
            ({ id }) => !removedDiscussionMessageIds.includes(id),
          ),
          "id",
        ).sort(
          (a, b) =>
            a.createdAt.toDate().getTime() - b.createdAt.toDate().getTime(),
        );

        nextState.discussionMessagesStates[discussionId] = {
          loading: false,
          fetched: true,
          data: uniq,
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
  .handleAction(actions.deleteDiscussionMessageById, (state, { payload }) =>
    produce(state, (nextState) => {
      const { discussionMessageId, discussionId } = payload;

      const updatedDiscussionMessages = (
        state.discussionMessagesStates[discussionId]?.data ?? []
      ).filter((message) => message.id !== discussionMessageId);

      nextState.discussionMessagesStates[discussionId] = {
        ...state.discussionMessagesStates[discussionId],
        data: updatedDiscussionMessages,
      };
    }),
  )
  .handleAction(actions.updateCommonMembersByCommonId, (state, { payload }) =>
    produce(state, (nextState) => {
      if (payload.commonId) {
        nextState.commonMembersState[payload.commonId] = {
          data: payload.commonMembers,
          loading: false,
          fetched: true,
        };
      }
    }),
  )
  .handleAction(actions.addUserToExternalCommonUsers, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.externalCommonUsers = [
        ...state.externalCommonUsers,
        payload.user,
      ];
    }),
  )
  .handleAction(
    actions.updateCommonMemberStateByUserAndCommonIds,
    (state, { payload }) =>
      produce(state, (nextState) => {
        const { userId, commonId, state } = payload;

        nextState.commonMemberByUserAndCommonIdsStates[
          getCommonMemberStateKey({
            userId,
            commonId,
          })
        ] = { ...state };
      }),
  )
  .handleAction(
    actions.updateDiscussionMessageReactions,
    (state, { payload }) =>
      produce(state, (nextState) => {
        const { discussionMessageId, discussionId, emoji } = payload;

        if (!discussionId) return;

        const updatedDiscussionMessages = cloneDeep(
          state.discussionMessagesStates[discussionId],
        );
        const updatedMessage = updatedDiscussionMessages.data?.find(
          (msg) => msg.id === discussionMessageId,
        );
        const isUserDiscussionMessage =
          checkIsUserDiscussionMessage(updatedMessage);

        if (!isUserDiscussionMessage) return;

        if (
          updatedMessage.reactionCounts ||
          updatedMessage.reactionCounts?.[emoji]
        ) {
          updatedMessage.reactionCounts[emoji] += 1;
        } else {
          updatedMessage.reactionCounts = {};
          updatedMessage.reactionCounts[emoji] = 1;
        }

        nextState.discussionMessagesStates[discussionId] = {
          ...state.discussionMessagesStates[discussionId],
          data: updatedDiscussionMessages.data,
        };
      }),
  );
