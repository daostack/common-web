import produce from "immer";
import { WritableDraft } from "immer/dist/types/types-external";
import { ActionType, createReducer } from "typesafe-actions";
import { CommonFeed } from "@/shared/models";
import * as actions from "./actions";
import { CommonState, FeedItems } from "./types";

type Action = ActionType<typeof actions>;

const initialFeedItems: FeedItems = {
  data: null,
  loading: false,
  hasMore: false,
  firstDocTimestamp: null,
  lastDocTimestamp: null,
};

const initialState: CommonState = {
  feedItems: { ...initialFeedItems },
  sharedFeedItemId: null,
  sharedFeedItem: null,
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
  recentFeedItemId: "",
};

const updateFeedItemInList = (
  state: WritableDraft<CommonState>,
  payload: {
    item: Partial<CommonFeed> & { id: string };
    isRemoved?: boolean;
  },
): void => {
  if (!state.feedItems.data) {
    return;
  }

  const { item: updatedItem, isRemoved = false } = payload;
  const feedItemIndex = state.feedItems.data?.findIndex(
    (item) => item.id === updatedItem.id,
  );

  if (feedItemIndex === -1) {
    return;
  }

  const nextData = [...state.feedItems.data];

  if (isRemoved) {
    nextData.splice(feedItemIndex, 1);
  } else {
    nextData[feedItemIndex] = {
      ...nextData[feedItemIndex],
      ...updatedItem,
    };
  }

  state.feedItems = {
    ...state.feedItems,
    data: nextData,
  };
};

const updateSharedFeedItem = (
  state: WritableDraft<CommonState>,
  payload: {
    item: Partial<CommonFeed> & { id: string };
    isRemoved?: boolean;
  },
): void => {
  const { item: updatedItem, isRemoved = false } = payload;

  if (state.sharedFeedItem?.id !== updatedItem.id) {
    return;
  }

  if (isRemoved) {
    state.sharedFeedItem = null;
    state.sharedFeedItemId = null;
  } else {
    state.sharedFeedItem = {
      ...state.sharedFeedItem,
      ...updatedItem,
    };
  }
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
  .handleAction(
    [
      actions.createSurveyProposal.request,
      actions.createFundingProposal.request,
    ],
    (state) =>
      produce(state, (nextState) => {
        nextState.proposalCreation = {
          ...nextState.proposalCreation,
          loading: true,
        };
      }),
  )
  .handleAction(
    [
      actions.createSurveyProposal.success,
      actions.createFundingProposal.success,
    ],
    (state) =>
      produce(state, (nextState) => {
        nextState.proposalCreation = {
          loading: false,
          data: null,
        };
      }),
  )
  .handleAction(
    [
      actions.createSurveyProposal.failure,
      actions.createFundingProposal.failure,
    ],
    (state) =>
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
      const payloadData = nextState.sharedFeedItemId
        ? payload.data &&
          payload.data.filter((item) => item.id !== nextState.sharedFeedItemId)
        : payload.data;

      nextState.feedItems = {
        ...payload,
        data:
          payloadData && (nextState.feedItems.data || []).concat(payloadData),
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
        lastDocTimestamp: null,
      };
    }),
  )
  .handleAction(actions.addNewFeedItems, (state, { payload }) =>
    produce(state, (nextState) => {
      let firstDocTimestamp = nextState.feedItems.firstDocTimestamp;

      const data = payload.reduceRight(
        (acc, { commonFeedItem, statuses: { isRemoved } }) => {
          const nextData = [...acc];
          const itemIndex = nextData.findIndex(
            (item) => item.id === commonFeedItem.id,
          );

          if (isRemoved) {
            if (itemIndex >= 0) {
              nextData.splice(itemIndex, 1);
            }

            return nextData;
          }

          firstDocTimestamp = commonFeedItem.updatedAt;

          if (itemIndex < 0) {
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
        firstDocTimestamp,
      };
    }),
  )
  .handleAction(actions.updateFeedItem, (state, { payload }) =>
    produce(state, (nextState) => {
      updateFeedItemInList(nextState, payload);
      updateSharedFeedItem(nextState, payload);
    }),
  )
  .handleAction(actions.resetFeedItems, (state) =>
    produce(state, (nextState) => {
      nextState.feedItems = { ...initialFeedItems };
    }),
  )
  .handleAction(actions.setIsNewProjectCreated, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.isNewProjectCreated = payload;
    }),
  )
  .handleAction(actions.setSharedFeedItemId, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.sharedFeedItemId = payload;
    }),
  )
  .handleAction(actions.setSharedFeedItem, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.sharedFeedItem = payload;
    }),
  )
  .handleAction(actions.setRecentFeedItemId, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.recentFeedItemId = payload;
    }),
  );
