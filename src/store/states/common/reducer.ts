import produce from "immer";
import { WritableDraft } from "immer/dist/types/types-external";
import { differenceBy } from "lodash";
import { ActionType, createReducer } from "typesafe-actions";
import { InboxItemType } from "@/shared/constants";
import {
  deserializeFeedItemFollowLayoutItem,
  FeedItemFollowLayoutItem,
} from "@/shared/interfaces";
import { CommonFeed } from "@/shared/models";
import {
  areTimestampsEqual,
  convertToTimestamp,
  sortFeedItemFollowLayoutItems as sortFeedItems,
} from "@/shared/utils";
import * as actions from "./actions";
import {
  CommonSearchState,
  CommonState,
  FeedItems,
  PinnedFeedItems,
} from "./types";

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

const initialSearchState: CommonSearchState = {
  isSearching: false,
  feedItems: null,
  pinnedFeedItems: null,
  searchValue: "",
};

const initialState: CommonState = {
  feedItems: { ...initialFeedItems },
  pinnedFeedItems: { ...initialPinnedFeedItems },
  searchState: { ...initialSearchState },
  sharedFeedItemId: null,
  sharedFeedItem: null,
  optimisticFeedItems: new Map(),
  optimisticDiscussionMessages: new Map(),
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
  recentAssignedCircleByMember: {},
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
    data: nextData,
  };

  if (
    !areTimestampsEqual(state.feedItems.firstDocTimestamp, firstDocTimestamp)
  ) {
    state.feedItems.firstDocTimestamp = firstDocTimestamp;
  }

  if (!areTimestampsEqual(state.feedItems.lastDocTimestamp, lastDocTimestamp)) {
    state.feedItems.lastDocTimestamp = lastDocTimestamp;
  }
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
  };

  if (
    !areTimestampsEqual(state.feedItems.firstDocTimestamp, firstDocTimestamp)
  ) {
    state.feedItems.firstDocTimestamp = firstDocTimestamp;
  }

  if (!areTimestampsEqual(state.feedItems.lastDocTimestamp, lastDocTimestamp)) {
    state.feedItems.lastDocTimestamp = lastDocTimestamp;
  }
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
        payload.data.filter(
          (item) => item.feedItem.id !== nextState.sharedFeedItemId,
        )
        : payload.data;
      const nextData = nextState.feedItems.data || [];
      const filteredPayloadData =
        payloadData && differenceBy(payloadData, nextData, "feedItem.id");

      nextState.feedItems = {
        ...payload,
        data: filteredPayloadData && nextData.concat(filteredPayloadData),
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
  .handleAction(actions.setSearchState, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.searchState = payload;
    }),
  )
  .handleAction(actions.resetSearchState, (state) =>
    produce(state, (nextState) => {
      nextState.searchState = { ...initialSearchState };
    }),
  )
  .handleAction(actions.updateSearchFeedItems, (state, { payload }) =>
    produce(state, (nextState) => {
      if (!nextState.searchState.feedItems) {
        nextState.searchState.feedItems = [];
      }

      payload.forEach((feedItemEntityId) => {
        const feedItem = nextState.feedItems.data?.find(
          (item) =>
            item.feedItem.data.id === feedItemEntityId ||
            item.feedItem.data.discussionId === feedItemEntityId,
        );

        if (feedItem) {
          nextState.searchState.feedItems!.push(feedItem);
        }
      });
    }),
  )
  .handleAction(actions.setIsSearchingFeedItems, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.searchState.isSearching = payload;
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
        data:
          feedItems.data &&
          feedItems.data.map(deserializeFeedItemFollowLayoutItem),
        firstDocTimestamp:
          (feedItems.firstDocTimestamp &&
            convertToTimestamp(feedItems.firstDocTimestamp)) ||
          null,
        lastDocTimestamp:
          (feedItems.lastDocTimestamp &&
            convertToTimestamp(feedItems.lastDocTimestamp)) ||
          null,
        hasMore: true,
      };
      nextState.pinnedFeedItems = {
        ...pinnedFeedItems,
        data:
          pinnedFeedItems.data &&
          pinnedFeedItems.data.map(deserializeFeedItemFollowLayoutItem),
      };

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
      nextState.pinnedFeedItems = { ...initialPinnedFeedItems };
      nextState.sharedFeedItemId = null;
      nextState.sharedFeedItem = null;
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
  .handleAction(actions.setRecentAssignedCircleByMember, (state, { payload }) =>
    produce(state, (nextState) => {
      const { memberId, circle } = payload;

      nextState.recentAssignedCircleByMember[memberId] = circle;
    }),
  )
  .handleAction(actions.resetRecentAssignedCircleByMember, (state) =>
    produce(state, (nextState) => {
      nextState.recentAssignedCircleByMember = {};
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
  )
  .handleAction(actions.setOptimisticFeedItem, (state, { payload }) =>
    produce(state, (nextState) => {
        const updatedMap = new Map(nextState.optimisticFeedItems);

        const optimisticItemId = payload.data.discussionId ?? payload.data.id;
        // Add the new item to the Map
        updatedMap.set(optimisticItemId, {
          type: InboxItemType.FeedItemFollow,
          itemId: payload.id,
          feedItem: payload,
        });

        // Assign the new Map back to the state
        nextState.optimisticFeedItems = updatedMap;
        nextState.recentStreamId = optimisticItemId;
    }),
  )
  .handleAction(actions.updateOptimisticFeedItemState, (state, { payload }) =>
    produce(state, (nextState) => {
      const updatedMap = new Map(nextState.optimisticFeedItems);

      const optimisticFeedItem = updatedMap.get(payload.id);
      // Add the new item to the Map

      if(optimisticFeedItem && optimisticFeedItem?.feedItem.optimisticData) {
        updatedMap.set(payload.id, {
          ...optimisticFeedItem,
          feedItem: {
            ...optimisticFeedItem?.feedItem,
            optimisticData: {
              ...optimisticFeedItem.feedItem.optimisticData,
              state: payload.state
            }
          }
        });
      }

      // Assign the new Map back to the state
      nextState.optimisticFeedItems = updatedMap;
    }),
  )
  .handleAction(actions.removeOptimisticFeedItemState, (state, { payload }) =>
    produce(state, (nextState) => {
      const updatedMap = new Map(nextState.optimisticFeedItems);

      updatedMap.delete(payload.id);

      // Assign the new Map back to the state
      nextState.optimisticFeedItems = updatedMap;
    }),
  )
  .handleAction(actions.setOptimisticDiscussionMessages, (state, { payload }) =>
    produce(state, (nextState) => {
        const updatedMap = new Map(nextState.optimisticDiscussionMessages);

        const discussionMessages = updatedMap.get(payload.discussionId) ?? [];
        discussionMessages.push(payload);
        // Add the new item to the Map
        updatedMap.set(payload.discussionId, discussionMessages);

        // Assign the new Map back to the state
        nextState.optimisticDiscussionMessages = updatedMap;
    }),
  )
  .handleAction(actions.clearOptimisticDiscussionMessages, (state, { payload }) =>
    produce(state, (nextState) => {
      const updatedMap = new Map(nextState.optimisticDiscussionMessages);

      updatedMap.delete(payload);

      // Assign the new Map back to the state
      nextState.optimisticDiscussionMessages = updatedMap;
    }),
  );
