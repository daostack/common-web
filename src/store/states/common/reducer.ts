import produce from "immer";
import { ActionType, createReducer } from "typesafe-actions";
import * as actions from "./actions";
import { CommonState, FeedItems } from "./types";

type Action = ActionType<typeof actions>;

const initialFeedItems: FeedItems = {
  data: null,
  loading: false,
  hasMore: false,
  lastDocSnapshot: null,
};

const initialState: CommonState = {
  feedItems: { ...initialFeedItems },
  discussionCreationData: null,
};

export const reducer = createReducer<CommonState, Action>(initialState)
  .handleAction(actions.resetCommon, (state) =>
    produce(state, (nextState) => {
      nextState.feedItems = { ...initialFeedItems };
      nextState.discussionCreationData = null;
    }),
  )
  .handleAction(actions.setDiscussionCreationData, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.discussionCreationData = payload;
    }),
  )
  .handleAction(actions.getFeedItems.request, (state) =>
    produce(state, (nextState) => {
      nextState.feedItems = {
        ...nextState.feedItems,
        loading: true,
      };
    }),
  )
  .handleAction(actions.getFeedItems.success, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.feedItems = {
        ...payload,
        data:
          payload.data && (nextState.feedItems.data || []).concat(payload.data),
        loading: false,
      };
    }),
  )
  .handleAction(actions.getFeedItems.failure, (state) =>
    produce(state, (nextState) => {
      nextState.feedItems = {
        ...nextState.feedItems,
        loading: false,
        hasMore: false,
        lastDocSnapshot: null,
      };
    }),
  );
