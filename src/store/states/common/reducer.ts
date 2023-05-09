import produce from "immer";
import { WritableDraft } from "immer/dist/types/types-external";
import { ActionType, createReducer } from "typesafe-actions";
import { FeedLayoutItem } from "@/pages/commonFeed";
import { CommonFeed } from "@/shared/models";
import * as actions from "./actions";
import { CommonState, FeedItems, PinnedFeedItems } from "./types";

type Action = ActionType<typeof actions>;

const initialFeedItems: FeedItems = {
  data: null,
  loading: false,
  hasMore: false,
  firstDocTimestamp: null,
  lastDocTimestamp: null,
};

const initialPinnedFeedItems: PinnedFeedItems = {
  data: null,
  loading: false,
};

const initialState: CommonState = {
  feedItems: { ...initialFeedItems },
  pinnedFeedItems: { ...initialPinnedFeedItems },
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
  recentStreamId: "",
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
    (item) => item.feedItem.id === updatedItem.id,
  );

  if (feedItemIndex === -1) {
    return;
  }

  const nextData = [...state.feedItems.data];

  if (isRemoved) {
    nextData.splice(feedItemIndex, 1);
  } else {
    nextData[feedItemIndex] = {
      feedItem: {
        ...nextData[feedItemIndex].feedItem,
        ...updatedItem,
      },
    };
  }

  state.feedItems = {
    ...state.feedItems,
    data: nextData,
  };
};

const addNewFeedItems = (
  state: WritableDraft<CommonState>,
  payload: {
    commonFeedItem: CommonFeed;
    statuses: {
      isAdded: boolean;
      isRemoved: boolean;
    };
  }[],
) => {
  let firstDocTimestamp = state.feedItems.firstDocTimestamp;

  const data = payload.reduceRight(
    (acc, { commonFeedItem, statuses: { isRemoved } }) => {
      const nextData = [...acc];
      const itemIndex = nextData.findIndex(
        (item) => item.feedItem.id === commonFeedItem.id,
      );

      if (isRemoved) {
        if (itemIndex >= 0) {
          nextData.splice(itemIndex, 1);
        }

        return nextData;
      }

      const finalItem: FeedLayoutItem = {
        feedItem: commonFeedItem,
      };
      firstDocTimestamp = commonFeedItem.updatedAt;

      if (itemIndex < 0) {
        return [finalItem, ...nextData];
      }

      nextData[itemIndex] = finalItem;

      return nextData;
    },
    state.feedItems.data || [],
  );

  state.feedItems = {
    ...state.feedItems,
    data,
    firstDocTimestamp,
  };
};

const addNewPinnedFeedItems = (
  state: WritableDraft<CommonState>,
  payload: {
    commonFeedItem: CommonFeed;
    statuses: {
      isAdded: boolean;
      isRemoved: boolean;
    };
  }[],
) => {
  const data = payload.reduceRight(
    (acc, { commonFeedItem, statuses: { isRemoved } }) => {
      const nextData = [...acc];
      const itemIndex = nextData.findIndex(
        (item) => item.feedItem.id === commonFeedItem.id,
      );

      if (isRemoved) {
        if (itemIndex >= 0) {
          nextData.splice(itemIndex, 1);
        }

        return nextData;
      }

      const finalItem: FeedLayoutItem = {
        feedItem: commonFeedItem,
      };

      if (itemIndex < 0) {
        return [finalItem, ...nextData];
      }

      nextData[itemIndex] = finalItem;

      return nextData;
    },
    state.pinnedFeedItems.data || [],
  );

  state.pinnedFeedItems = {
    ...state.pinnedFeedItems,
    data,
  };
};

const updatePinnedFeedItemInList = (
  state: WritableDraft<CommonState>,
  payload: {
    item: Partial<CommonFeed> & { id: string };
    isRemoved?: boolean;
  },
): void => {
  if (!state.pinnedFeedItems.data) {
    return;
  }

  const { item: updatedItem, isRemoved = false } = payload;
  const feedItemIndex = state.pinnedFeedItems.data?.findIndex(
    (item) => item.feedItem.id === updatedItem.id,
  );

  if (feedItemIndex === -1) {
    return;
  }

  const nextData = [...state.pinnedFeedItems.data];

  if (isRemoved) {
    nextData.splice(feedItemIndex, 1);
  } else {
    nextData[feedItemIndex] = {
      feedItem: {
        ...nextData[feedItemIndex].feedItem,
        ...updatedItem,
      },
    };
  }

  state.pinnedFeedItems = {
    ...state.pinnedFeedItems,
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

  if (state.sharedFeedItem?.feedItem.id !== updatedItem.id) {
    return;
  }

  if (isRemoved) {
    state.sharedFeedItem = null;
    state.sharedFeedItemId = null;
  } else {
    state.sharedFeedItem = {
      feedItem: {
        ...state.sharedFeedItem.feedItem,
        ...updatedItem,
      },
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
  .handleAction(actions.createDiscussion.success, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.discussionCreation = {
        loading: false,
        data: null,
      };
      nextState.recentStreamId = payload.id;
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
    (state, { payload }) =>
      produce(state, (nextState) => {
        nextState.proposalCreation = {
          loading: false,
          data: null,
        };
        nextState.recentStreamId = payload.id;
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
          payload.data.filter(
            (item) => item.feedItem.id !== nextState.sharedFeedItemId,
          )
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
  .handleAction(actions.getPinnedFeedItems.request, (state) =>
    produce(state, (nextState) => {
      nextState.pinnedFeedItems = {
        ...nextState.pinnedFeedItems,
        loading: true,
      };
    }),
  )
  .handleAction(actions.getPinnedFeedItems.success, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.pinnedFeedItems = {
        data: payload.data,
        loading: false,
      };
    }),
  )
  .handleAction(actions.getPinnedFeedItems.failure, (state) =>
    produce(state, (nextState) => {
      nextState.pinnedFeedItems = {
        ...nextState.pinnedFeedItems,
        loading: false,
      };
    }),
  )
  .handleAction(actions.addNewFeedItems, (state, { payload }) =>
    produce(state, (nextState) => {
      addNewFeedItems(nextState, payload);
    }),
  )
  .handleAction(actions.addNewPinnedFeedItems, (state, { payload }) =>
    produce(state, (nextState) => {
      addNewPinnedFeedItems(nextState, payload);
      addNewFeedItems(
        nextState,
        payload.map((item) => ({
          ...item,
          statuses: {
            isAdded: false,
            isRemoved: true,
          },
        })),
      );
    }),
  )
  .handleAction(actions.updateFeedItem, (state, { payload }) =>
    produce(state, (nextState) => {
      updateFeedItemInList(nextState, payload);
      updatePinnedFeedItemInList(nextState, payload);
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
      nextState.sharedFeedItem = payload
        ? {
            feedItem: payload,
          }
        : null;
    }),
  );
