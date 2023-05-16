import produce from "immer";
import { ActionType, createReducer } from "typesafe-actions";
import { FollowFeedItemAction } from "@/shared/constants";
import * as actions from "./actions";
import { CommonFeedFollowsState } from "./types";
import { getFollowFeedItemMutationId } from "./utils";

type Action = ActionType<typeof actions>;

const initialState: CommonFeedFollowsState = {
  followFeedItemMutation: {},
  follows: {},
};

export const reducer = createReducer<CommonFeedFollowsState, Action>(
  initialState,
)
  .handleAction(actions.followFeedItem.request, (state, action) =>
    produce(state, (nextState) => {
      const mutationId = getFollowFeedItemMutationId(
        action.payload.commonId,
        action.payload.feedItemId,
      );
      nextState.follows[action.payload.commonId] =
        nextState.follows[action.payload.commonId] || {};
      nextState.follows[action.payload.commonId][action.payload.feedItemId] =
        action.payload.action === FollowFeedItemAction.Follow;
      nextState.followFeedItemMutation[mutationId] = {
        isFollowingInProgress: true,
        isFollowingFinished: false,
      };
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
      nextState.follows[payload.commonId] =
        nextState.follows[payload.commonId] || {};
      nextState.follows[payload.commonId][payload.itemId] = payload.isFollowing;
    }),
  );
