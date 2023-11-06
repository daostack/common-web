import produce from "immer";
import { WritableDraft } from "immer/dist/types/types-external";
import { ActionType, createReducer } from "typesafe-actions";
import { InboxItemType } from "@/shared/constants";
import { FeedItemFollowLayoutItem } from "@/shared/interfaces";
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
  batchNumber: 0,
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
  recentAssignedCircle: null,
};

const sortFeedItems = (data: FeedItemFollowLayoutItem[]): void => {
  data.sort(
    (prevItem, nextItem) =>
      nextItem.feedItem.updatedAt.seconds - prevItem.feedItem.updatedAt.seconds,
  );
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

  const { item: updatedItem } = payload;
  const isRemoved = payload.isRemoved || updatedItem.isDeleted;
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
      ...nextData[feedItemIndex],
      feedItem: {
        ...nextData[feedItemIndex].feedItem,
        ...updatedItem,
      },
    };
    sortFeedItems(nextData);
  }

  const firstDocTimestamp = nextData[0]?.feedItem.updatedAt || null;
  const lastDocTimestamp =
    nextData[nextData.length - 1]?.feedItem.updatedAt || null;

  state.feedItems = {
    ...state.feedItems,
    firstDocTimestamp,
    lastDocTimestamp,
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
  shouldSortNewItems = false,
) => {
  const data = payload.reduceRight((acc, { commonFeedItem, statuses }) => {
    const nextData = [...acc];
    const itemIndex = nextData.findIndex(
      (item) => item.feedItem.id === commonFeedItem.id,
    );
    const isRemoved = statuses.isRemoved || commonFeedItem.isDeleted;

    if (isRemoved) {
      if (itemIndex >= 0) {
        nextData.splice(itemIndex, 1);
      }

      return nextData;
    }

    const finalItem: FeedItemFollowLayoutItem = {
      type: InboxItemType.FeedItemFollow,
      itemId: commonFeedItem.id,
      feedItem: commonFeedItem,
    };

    if (itemIndex >= 0) {
      nextData[itemIndex] = finalItem;
      return nextData;
    }
    if (!shouldSortNewItems) {
      return [finalItem, ...nextData];
    }

    const indexForItemPlacement = nextData.findIndex(
      (item) => finalItem.feedItem.updatedAt > item.feedItem.updatedAt,
    );

    if (indexForItemPlacement === -1) {
      return [finalItem, ...nextData];
    }

    nextData.splice(indexForItemPlacement, 0, finalItem);

    return nextData;
  }, state.feedItems.data || []);
  sortFeedItems(data);

  const firstDocTimestamp = data[0]?.feedItem.updatedAt || null;
  const lastDocTimestamp = data[data.length - 1]?.feedItem.updatedAt || null;

  state.feedItems = {
    ...state.feedItems,
    data,
    firstDocTimestamp,
    lastDocTimestamp,
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
  const data = payload.reduceRight((acc, { commonFeedItem, statuses }) => {
    const nextData = [...acc];
    const itemIndex = nextData.findIndex(
      (item) => item.feedItem.id === commonFeedItem.id,
    );
    const isRemoved = statuses.isRemoved || commonFeedItem.isDeleted;

    if (isRemoved) {
      if (itemIndex >= 0) {
        nextData.splice(itemIndex, 1);
      }

      return nextData;
    }

    const finalItem: FeedItemFollowLayoutItem = {
      type: InboxItemType.FeedItemFollow,
      itemId: commonFeedItem.id,
      feedItem: commonFeedItem,
    };

    if (itemIndex < 0) {
      return [...nextData, finalItem];
    }

    nextData[itemIndex] = finalItem;

    return nextData;
  }, state.pinnedFeedItems.data || []);

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
): FeedItemFollowLayoutItem | null => {
  if (!state.pinnedFeedItems.data) {
    return null;
  }

  const { item: updatedItem } = payload;
  const isRemoved = payload.isRemoved || updatedItem.isDeleted;
  const feedItemIndex = state.pinnedFeedItems.data?.findIndex(
    (item) => item.feedItem.id === updatedItem.id,
  );

  if (feedItemIndex === -1) {
    return null;
  }

  const nextData = [...state.pinnedFeedItems.data];
  let itemToReturn: FeedItemFollowLayoutItem;

  if (isRemoved) {
    itemToReturn = nextData[feedItemIndex];
    nextData.splice(feedItemIndex, 1);
  } else {
    nextData[feedItemIndex] = {
      ...nextData[feedItemIndex],
      feedItem: {
        ...nextData[feedItemIndex].feedItem,
        ...updatedItem,
      },
    };
    itemToReturn = nextData[feedItemIndex];
  }

  state.pinnedFeedItems = {
    ...state.pinnedFeedItems,
    data: nextData,
  };

  return itemToReturn || null;
};

const updateSharedFeedItem = (
  state: WritableDraft<CommonState>,
  payload: {
    item: Partial<CommonFeed> & { id: string };
    isRemoved?: boolean;
  },
): void => {
  const { item: updatedItem } = payload;
  const isRemoved = payload.isRemoved || updatedItem.isDeleted;

  if (state.sharedFeedItem?.feedItem.id !== updatedItem.id) {
    return;
  }

  if (isRemoved) {
    state.sharedFeedItem = null;
    state.sharedFeedItemId = null;
  } else {
    state.sharedFeedItem = {
      ...state.sharedFeedItem,
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
  .handleAction(actions.editDiscussion.request, (state) =>
    produce(state, (nextState) => {
      nextState.discussionCreation = {
        ...nextState.discussionCreation,
        loading: true,
      };
    }),
  )
  .handleAction(actions.editDiscussion.success, (state) =>
    produce(state, (nextState) => {
      nextState.discussionCreation = {
        loading: false,
        data: null,
      };
    }),
  )
  .handleAction(actions.editDiscussion.failure, (state) =>
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
        batchNumber: nextState.feedItems.batchNumber + 1,
      };
    }),
  )
  .handleAction(actions.getFeedItems.failure, (state) =>
    produce(state, (nextState) => {
      nextState.feedItems = {
        ...nextState.feedItems,
        data: nextState.feedItems.data || [],
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
        data: nextState.pinnedFeedItems.data || [],
        loading: false,
      };
    }),
  )
  .handleAction(actions.setFeedState, (state, { payload }) =>
    produce(state, (nextState) => {
      const {
        data: { feedItems, pinnedFeedItems, sharedFeedItem },
        sharedFeedItemId,
      } = payload;
      nextState.feedItems = {
        ...feedItems,
        hasMore: true,
      };
      nextState.pinnedFeedItems = { ...pinnedFeedItems };

      if (sharedFeedItem && sharedFeedItem.itemId === sharedFeedItemId) {
        return;
      }
      if (
        sharedFeedItem &&
        !pinnedFeedItems.data?.some(
          (item) => item.itemId === sharedFeedItem.itemId,
        ) &&
        !feedItems.data?.some((item) => item.itemId === sharedFeedItem.itemId)
      ) {
        const data = [sharedFeedItem, ...(feedItems.data || [])];
        sortFeedItems(data);
        nextState.feedItems.data = data;
      }
      if (sharedFeedItemId) {
        nextState.feedItems.data =
          nextState.feedItems.data &&
          nextState.feedItems.data.filter(
            (item) => item.itemId !== sharedFeedItemId,
          );
        nextState.pinnedFeedItems.data =
          nextState.pinnedFeedItems.data &&
          nextState.pinnedFeedItems.data.filter(
            (item) => item.itemId !== sharedFeedItemId,
          );
      }
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
  .handleAction(actions.unpinFeedItems, (state, { payload }) =>
    produce(state, (nextState) => {
      const removedItems: FeedItemFollowLayoutItem[] = [];
      payload.forEach((itemId) => {
        const removedItem = updatePinnedFeedItemInList(nextState, {
          item: { id: itemId },
          isRemoved: true,
        });

        if (removedItem) {
          removedItems.push(removedItem);
        }
      });

      if (removedItems.length === 0) {
        return;
      }

      addNewFeedItems(
        nextState,
        removedItems.map((item) => ({
          commonFeedItem: item.feedItem,
          statuses: {
            isAdded: true,
            isRemoved: false,
          },
        })),
        true,
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
  .handleAction(actions.setRecentStreamId, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.recentStreamId = payload;
    }),
  )
  .handleAction(actions.setRecentAssignedCircle, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.recentAssignedCircle = payload;
    }),
  )
  .handleAction(actions.setSharedFeedItem, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.sharedFeedItem = payload
        ? {
            type: InboxItemType.FeedItemFollow,
            itemId: payload.id,
            feedItem: payload,
          }
        : null;
    }),
  );
