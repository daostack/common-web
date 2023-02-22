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
  isNewProjectCreated: false,
  proposalCreation: {
    data: null,
    loading: false,
  },
  commonMember: null,
  governance: null,
};

export const reducer = createReducer<CommonState, Action>(initialState)
  .handleAction(actions.resetCommon, () => ({ ...initialState }))
  .handleAction(actions.setCommonAction, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.commonAction = payload;
    }),
  )
  .handleAction(actions.setCommonMember, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.commonMember = payload;
    }),
  )
  .handleAction(actions.setCommonGovernance, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.governance = payload;
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
  )
  .handleAction(actions.updateFeedItem, (state, { payload }) =>
    produce(state, (nextState) => {
      if (!nextState.feedItems.data) {
        return;
      }

      const { item: updatedItem, isRemoved = false } = payload;
      const feedItemIndex = nextState.feedItems.data?.findIndex(
        (item) => item.id === updatedItem.id,
      );

      if (feedItemIndex === -1) {
        return;
      }

      const nextData = [...nextState.feedItems.data];

      if (isRemoved) {
        nextData.splice(feedItemIndex, 1);
      } else {
        nextData[feedItemIndex] = {
          ...nextData[feedItemIndex],
          ...updatedItem,
        };
      }

      nextState.feedItems = {
        ...nextState.feedItems,
        data: nextData,
      };
    }),
  )
  .handleAction(actions.setIsNewProjectCreated, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.isNewProjectCreated = payload;
    }),
  );
