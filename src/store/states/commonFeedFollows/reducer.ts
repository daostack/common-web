import produce from "immer";
import { WritableDraft } from "immer/dist/internal";
import { ActionType, createReducer } from "typesafe-actions";
import { FollowFeedItemAction } from "@/shared/constants";
import { FollowFeedItemPayload } from "@/shared/interfaces/api";
import * as actions from "./actions";
import { CommonFeedFollowsState, FollowFeedItemMutationState } from "./types";
import { getFollowFeedItemMutationId } from "./utils";

type Action = ActionType<typeof actions>;

const initialState: CommonFeedFollowsState = {
  followFeedItemMutation: {},
  follows: {},
};

const updateFeedItemFollow = (
  state: WritableDraft<CommonFeedFollowsState>,
  payload: FollowFeedItemPayload,
  mutationState: FollowFeedItemMutationState,
) => {
  const mutationId = getFollowFeedItemMutationId(
    payload.commonId,
    payload.feedItemId,
  );
  state.follows[payload.commonId] = state.follows[payload.commonId] || {};
  state.follows[payload.commonId][payload.feedItemId] =
    payload.action === FollowFeedItemAction.Follow;
  state.followFeedItemMutation[mutationId] = mutationState;
};

export const reducer = createReducer<CommonFeedFollowsState, Action>(
  initialState,
)
  .handleAction(actions.followFeedItem.request, (state, action) =>
    produce(state, (nextState) => {
      updateFeedItemFollow(nextState, action.payload, {
        isFollowingInProgress: true,
        isFollowingFinished: false,
      });
    }),
  )
  .handleAction(actions.followFeedItem.success, (state, action) =>
    produce(state, (nextState) => {
      const mutationId = getFollowFeedItemMutationId(
        action.payload.commonId,
        action.payload.feedItemId,
      );
      delete nextState.followFeedItemMutation[mutationId];
      nextState.follows[action.payload.commonId][action.payload.feedItemId] =
        action.payload.action === FollowFeedItemAction.Follow;
    }),
  )
  .handleAction(actions.followFeedItem.cancel, (state, action) =>
    produce(state, (nextState) => {
      const mutationId = getFollowFeedItemMutationId(
        action.payload.commonId,
        action.payload.feedItemId,
      );
      delete nextState.followFeedItemMutation[mutationId];
    }),
  )
  .handleAction(actions.followFeedItem.failure, (state, action) =>
    produce(state, (nextState) => {
      const mutationId = getFollowFeedItemMutationId(
        action.payload.commonId,
        action.payload.feedItemId,
      );
      nextState.followFeedItemMutation[mutationId] = {
        isFollowingInProgress: false,
        isFollowingFinished: false,
        isFollowingFinishedWithError: true,
      };
    }),
  )
  .handleAction(actions.setFeedItemFollow, (state, { payload }) =>
    produce(state, (nextState) => {
      updateFeedItemFollow(nextState, payload, {
        isFollowingInProgress: false,
        isFollowingFinished: true,
      });
    }),
  )
  .handleAction(actions.setFeedItemsFollowStateByCommon, (state, { payload }) =>
    produce(state, (nextState) => {
      const feedItemIds = Object.keys(nextState.follows[payload.commonId]);

      feedItemIds.forEach((itemId) => {
        const mutationId = getFollowFeedItemMutationId(
          payload.commonId,
          itemId,
        );
        const feedItemsFollow = nextState.follows[payload.commonId];

        if (feedItemsFollow[itemId] === payload.isFollowing) {
          return;
        }

        feedItemsFollow[itemId] = payload.isFollowing;
        nextState.followFeedItemMutation[mutationId] = {
          isFollowingInProgress: true,
          isFollowingFinished: false,
        };
      });
    }),
  );
