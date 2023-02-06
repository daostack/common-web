import produce from "immer";
import { ActionType, createReducer } from "typesafe-actions";
import * as actions from "./actions";
import { CommonState, FeedItems } from "./types";

type Action = ActionType<typeof actions>;

const initialFeedItems: FeedItems = {
  data: null,
  loading: false,
  hasMore: false,
  firstDocSnapshot: null,
  lastDocSnapshot: null,
};

const initialState: CommonState = {
  feedItems: { ...initialFeedItems },
  commonAction: null,
  discussionCreation: {
    data: null,
    loading: false,
  },
  proposalCreation: {
    data: null,
    loading: false,
  },
};

export const reducer = createReducer<CommonState, Action>(initialState)
  .handleAction(actions.resetCommon, () => ({ ...initialState }))
  .handleAction(actions.setCommonAction, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.commonAction = payload;
    }),
  )
  .handleAction(actions.setDiscussionCreationData, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.discussionCreation = {
        data: payload,
        loading: false,
      };
    }),
  )
  .handleAction(actions.setProposalCreationData, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.proposalCreation = {
        data: payload,
        loading: false,
      };
    }),
  )
  .handleAction(actions.createDiscussion.request, (state) =>
    produce(state, (nextState) => {
      nextState.discussionCreation = {
        ...nextState.discussionCreation,
        loading: true,
      };
    }),
  )
  .handleAction(actions.createDiscussion.success, (state) =>
    produce(state, (nextState) => {
      nextState.discussionCreation = {
        loading: false,
        data: null,
      };
    }),
  )
  .handleAction(actions.createDiscussion.failure, (state) =>
    produce(state, (nextState) => {
      nextState.discussionCreation = {
        ...nextState.discussionCreation,
        loading: false,
      };
    }),
  )
  .handleAction(actions.createSurveyProposal.request, (state) =>
    produce(state, (nextState) => {
      nextState.proposalCreation = {
        ...nextState.proposalCreation,
        loading: true,
      };
    }),
  )
  .handleAction(actions.createSurveyProposal.success, (state) =>
    produce(state, (nextState) => {
      nextState.proposalCreation = {
        loading: false,
        data: null,
      };
    }),
  )
  .handleAction(actions.createSurveyProposal.failure, (state) =>
    produce(state, (nextState) => {
      nextState.proposalCreation = {
        ...nextState.proposalCreation,
        loading: false,
      };
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
  )
  .handleAction(actions.addNewFeedItems, (state, { payload }) =>
    produce(state, (nextState) => {
      let firstDocSnapshot = nextState.feedItems.firstDocSnapshot;

      const data = payload.reduceRight(
        (acc, { commonFeedItem, docSnapshot }) => {
          const nextData = [...acc];
          const itemIndex = nextData.findIndex(
            (item) => item.id === commonFeedItem.id,
          );

          if (itemIndex < 0) {
            firstDocSnapshot = docSnapshot;
            return [commonFeedItem, ...nextData];
          }

          nextData[itemIndex] = commonFeedItem;

          return nextData;
        },
        nextState.feedItems.data || [],
      );

      nextState.feedItems = {
        ...nextState.feedItems,
        data,
        firstDocSnapshot,
      };
    }),
  );
