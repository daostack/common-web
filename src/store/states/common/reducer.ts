import produce from "immer";
import { WritableDraft } from "immer/dist/types/types-external";
import { differenceBy } from "lodash";
import { ActionType, createReducer } from "typesafe-actions";
import { InboxItemType } from "@/shared/constants";
import {
  deserializeFeedItemFollowLayoutItem,
  FeedItemFollowLayoutItem,
} from "@/shared/interfaces";
import { CommonFeed, Timestamp } from "@/shared/models";
import {
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

export const initialSearchState: CommonSearchState = {
  isSearching: false,
  feedItems: null,
  pinnedFeedItems: null,
  searchValue: "",
};

const initialState: CommonState = {
  feedItems: {},
  pinnedFeedItems: {},
  searchState: {},
  sharedFeedItem: {},
  commonAction: null,
  discussionCreations: {},
  proposalCreations: {},
  isNewProjectCreated: {},
  sharedFeedItemId: {},
  commonMembers: {},
  governance: {},
  recentStreamId: "",
  recentAssignedCircleByMember: {},
};

const updateFeedItemInList = (
  state: WritableDraft<CommonState>,
  commonId: string,
  payload: {
    item: Partial<CommonFeed> & { id: string };
    isRemoved?: boolean;
  },
): void => {
  const feedItems = state.feedItems[commonId];
  if (!feedItems || !feedItems.data) {
    return;
  }

  const { item: updatedItem } = payload;
  const isRemoved = payload.isRemoved || updatedItem.isDeleted;
  const feedItemIndex = feedItems.data.findIndex(
    (item) => item.feedItem.id === updatedItem.id,
  );

  if (feedItemIndex === -1) {
    return;
  }

  const nextData = [...feedItems.data];
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

  state.feedItems[commonId] = {
    ...feedItems,
    data: nextData,
    firstDocTimestamp,
    lastDocTimestamp,
  };
};

const addNewFeedItems = (
  state: WritableDraft<CommonState>,
  commonId: string,
  payload: {
    commonFeedItem: CommonFeed;
    statuses: {
      isAdded: boolean;
      isRemoved: boolean;
    };
  }[],
  shouldSortNewItems = false,
) => {
  const feedItems = state.feedItems[commonId] || initialFeedItems;

  const data = payload.reduceRight((acc, { commonFeedItem, statuses }) => {
    const nextData = [...acc];
    const itemIndex = nextData.findIndex((item) => {
      return item?.feedItem?.id === commonFeedItem?.id;
    });
    const isRemoved = statuses.isRemoved || commonFeedItem?.isDeleted;

    if (isRemoved) {
      if (itemIndex >= 0) {
        nextData.splice(itemIndex, 1);
      }
      return nextData;
    }

    const finalItem: FeedItemFollowLayoutItem = {
      type: InboxItemType.FeedItemFollow,
      itemId: commonFeedItem?.id,
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
  }, feedItems.data || []);
  sortFeedItems(data);

  const firstDocTimestamp = data[0]?.feedItem?.updatedAt || null;
  const lastDocTimestamp = data[data.length - 1]?.feedItem?.updatedAt || null;

  state.feedItems[commonId] = {
    ...feedItems,
    data,
    firstDocTimestamp,
    lastDocTimestamp,
  };
};

const addNewPinnedFeedItems = (
  state: WritableDraft<CommonState>,
  commonId: string,
  payload: {
    commonFeedItem: CommonFeed;
    statuses: {
      isAdded: boolean;
      isRemoved: boolean;
    };
  }[],
) => {
  const pinnedFeedItems = state.pinnedFeedItems[commonId] || {
    data: null,
    loading: false,
  };

  const data = payload.reduceRight((acc, { commonFeedItem, statuses }) => {
    const nextData = [...acc];

    const itemIndex = nextData.findIndex(
      (item) => item?.feedItem?.id === commonFeedItem.id,
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
  }, pinnedFeedItems.data || []);

  state.pinnedFeedItems[commonId] = {
    ...pinnedFeedItems,
    data,
  };
};

const updatePinnedFeedItemInList = (
  state: WritableDraft<CommonState>,
  commonId: string,
  payload: {
    item: Partial<CommonFeed> & { id: string };
    isRemoved?: boolean;
  },
): FeedItemFollowLayoutItem | null => {
  const pinnedFeedItems = state.pinnedFeedItems[commonId] || {
    data: null,
    loading: false,
  };
  if (!pinnedFeedItems.data) {
    return null;
  }

  const { item: updatedItem } = payload;
  const isRemoved = payload.isRemoved || updatedItem.isDeleted;
  const feedItemIndex = pinnedFeedItems.data.findIndex(
    (item) => item.feedItem.id === updatedItem.id,
  );

  if (feedItemIndex === -1) {
    return null;
  }

  const nextData = [...pinnedFeedItems.data];
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

  state.pinnedFeedItems[commonId] = {
    ...pinnedFeedItems,
    data: nextData,
  };

  return itemToReturn || null;
};

const updateSharedFeedItem = (
  state: WritableDraft<CommonState>,
  commonId: string,
  payload: {
    item: Partial<CommonFeed> & { id: string };
    isRemoved?: boolean;
  },
): void => {
  const sharedFeedItem = state.sharedFeedItem[commonId];
  const { item: updatedItem } = payload;
  const isRemoved = payload.isRemoved || updatedItem.isDeleted;

  if (!sharedFeedItem || sharedFeedItem.feedItem.id !== updatedItem.id) {
    return;
  }

  if (isRemoved) {
    state.sharedFeedItem[commonId] = null;
  } else {
    state.sharedFeedItem[commonId] = {
      ...sharedFeedItem,
      feedItem: {
        ...sharedFeedItem.feedItem,
        ...updatedItem,
      },
    };
  }
};

export const reducer = createReducer<CommonState, Action>(initialState)
  // Reset state
  .handleAction(actions.resetCommon, () => ({ ...initialState }))

  // Common Actions
  .handleAction(actions.setCommonAction, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.commonAction = payload;
    }),
  )
  .handleAction(actions.setCommonMember, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId, member } = payload;
      nextState.commonMembers[commonId] = member;
    }),
  )
  .handleAction(actions.setCommonGovernance, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId, governance } = payload;
      nextState.governance[commonId] = governance;
    }),
  )

  // Discussion Creation
  .handleAction(actions.setDiscussionCreationData, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId, data } = payload;
      nextState.discussionCreations[commonId] = {
        data,
        loading: false,
      };
    }),
  )
  .handleAction(actions.createDiscussion.request, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId } = payload;
      const discussionCreation = nextState.discussionCreations[commonId] || {
        data: null,
        loading: false,
      };
      nextState.discussionCreations[commonId] = {
        ...discussionCreation,
        loading: true,
      };
    }),
  )
  .handleAction(actions.createDiscussion.success, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId } = payload;
      nextState.discussionCreations[commonId] = {
        loading: false,
        data: null,
      };
    }),
  )
  .handleAction(actions.createDiscussion.failure, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId } = payload;
      const discussionCreation = nextState.discussionCreations[commonId] || {
        data: null,
        loading: false,
      };
      nextState.discussionCreations[commonId] = {
        ...discussionCreation,
        loading: false,
      };
    }),
  )
  .handleAction(actions.editDiscussion.request, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId } = payload;
      const discussionCreation = nextState.discussionCreations[commonId] || {
        data: null,
        loading: false,
      };
      nextState.discussionCreations[commonId] = {
        ...discussionCreation,
        loading: true,
      };
    }),
  )
  .handleAction(actions.editDiscussion.success, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId } = payload;
      nextState.discussionCreations[commonId] = {
        loading: false,
        data: null,
      };
    }),
  )
  .handleAction(actions.editDiscussion.failure, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId } = payload;
      const discussionCreation = nextState.discussionCreations[commonId] || {
        data: null,
        loading: false,
      };
      nextState.discussionCreations[commonId] = {
        ...discussionCreation,
        loading: false,
      };
    }),
  )

  // Proposal Creation
  .handleAction(actions.setProposalCreationData, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId, data } = payload;
      nextState.proposalCreations[commonId] = {
        data,
        loading: false,
      };
    }),
  )
  .handleAction(
    [
      actions.createSurveyProposal.request,
      actions.createFundingProposal.request,
    ],
    (state, { payload }) =>
      produce(state, (nextState) => {
        const { commonId } = payload;
        const proposalCreation = nextState.proposalCreations[commonId] || {
          data: null,
          loading: false,
        };
        nextState.proposalCreations[commonId] = {
          ...proposalCreation,
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
        const { commonId } = payload;
        nextState.proposalCreations[commonId] = {
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
    (state, { payload }) =>
      produce(state, (nextState) => {
        const { commonId } = payload;
        const proposalCreation = nextState.proposalCreations[commonId] || {
          data: null,
          loading: false,
        };
        nextState.proposalCreations[commonId] = {
          ...proposalCreation,
          loading: false,
        };
      }),
  )

  // Feed Items
  .handleAction(actions.getFeedItems.request, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId } = payload;
      const feedItems = nextState.feedItems[commonId] || initialFeedItems;
      nextState.feedItems[commonId] = { ...feedItems, loading: true };
    }),
  )
  .handleAction(actions.getFeedItems.success, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId, data, hasMore, firstDocTimestamp, lastDocTimestamp } =
        payload;
      const feedItems = nextState.feedItems[commonId] || initialFeedItems;

      const existingData = feedItems.data || [];
      const filteredData = differenceBy(data, existingData, "feedItem.id");

      nextState.feedItems[commonId] = {
        ...feedItems,
        data: [...existingData, ...filteredData],
        loading: false,
        hasMore,
        firstDocTimestamp,
        lastDocTimestamp,
      };
    }),
  )
  .handleAction(actions.getFeedItems.failure, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId } = payload;
      const feedItems = nextState.feedItems[commonId] || initialFeedItems;
      nextState.feedItems[commonId] = {
        ...feedItems,
        loading: false,
        hasMore: false,
      };
    }),
  )
  .handleAction(actions.addNewFeedItems, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId, items: newItems } = payload;
      const feedItems = nextState.feedItems[commonId] || initialFeedItems;
      const existingData = feedItems.data || [];

      const mappedNewItems = newItems.map(({ commonFeedItem }) => ({
        type: InboxItemType.FeedItemFollow as const,
        feedItem: commonFeedItem,
        itemId: commonFeedItem.id,
      }));

      const newData = differenceBy(mappedNewItems, existingData, "feedItem.id");
      nextState.feedItems[commonId] = {
        ...feedItems,
        data: [...existingData, ...newData],
      };
    }),
  )
  .handleAction(actions.updateFeedItem, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId, item, isRemoved } = payload;

      // Ensure the feedItems, pinnedFeedItems, and sharedFeedItems for the commonId exist
      if (!nextState.feedItems[commonId]) {
        nextState.feedItems[commonId] = { ...initialFeedItems };
      }
      if (!nextState.pinnedFeedItems[commonId]) {
        nextState.pinnedFeedItems[commonId] = { ...initialPinnedFeedItems };
      }
      if (!nextState.sharedFeedItem[commonId]) {
        nextState.sharedFeedItem[commonId] = null;
      }

      // Update lists for the specified commonId
      updateFeedItemInList(nextState, commonId, { item, isRemoved });
      updatePinnedFeedItemInList(nextState, commonId, { item, isRemoved });
      updateSharedFeedItem(nextState, commonId, { item, isRemoved });
    }),
  )

  // Pinned Feed Items
  .handleAction(actions.getPinnedFeedItems.request, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId } = payload;
      const pinnedFeedItems =
        nextState.pinnedFeedItems[commonId] || initialPinnedFeedItems;
      nextState.pinnedFeedItems[commonId] = {
        ...pinnedFeedItems,
        loading: true,
      };
    }),
  )
  .handleAction(actions.getPinnedFeedItems.success, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId, data } = payload;
      nextState.pinnedFeedItems[commonId] = {
        data,
        loading: false,
      };
    }),
  )
  .handleAction(actions.getPinnedFeedItems.failure, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId } = payload;
      const pinnedFeedItems =
        nextState.pinnedFeedItems[commonId] || initialPinnedFeedItems;
      nextState.pinnedFeedItems[commonId] = {
        ...pinnedFeedItems,
        loading: false,
      };
    }),
  )
  .handleAction(actions.addNewPinnedFeedItems, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId, items } = payload;

      // Ensure pinnedFeedItems and feedItems are initialized for the commonId
      if (!nextState.pinnedFeedItems[commonId]) {
        nextState.pinnedFeedItems[commonId] = { ...initialPinnedFeedItems };
      }
      if (!nextState.feedItems[commonId]) {
        nextState.feedItems[commonId] = { ...initialFeedItems };
      }

      // Add new pinned feed items
      addNewPinnedFeedItems(nextState, commonId, items);

      // Add items to feed items as "removed"
      addNewFeedItems(
        nextState,
        commonId,
        items.map((item) => ({
          ...item,
          statuses: {
            isAdded: false,
            isRemoved: true,
          },
        })),
        true, // Ensure sorting is applied if required
      );
    }),
  )

  // Shared Feed Item
  .handleAction(actions.setSharedFeedItem, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId, feedItem } = payload;
      nextState.sharedFeedItem[commonId] = feedItem
        ? {
            type: InboxItemType.FeedItemFollow,
            itemId: feedItem.id,
            feedItem,
          }
        : null;
    }),
  )
  .handleAction(actions.setFeedItemUpdatedAt, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId, feedItemId, lastMessage } = payload;

      const feedItems = nextState.feedItems[commonId]?.data || [];

      const updatedFeedItemIndex = feedItems.findIndex((feedItem) => {
        return feedItem?.feedItem?.id === feedItemId;
      });

      if (updatedFeedItemIndex !== -1) {
        const item = feedItems[updatedFeedItemIndex];
        item.feedItem = {
          ...item.feedItem,
          updatedAt: Timestamp.fromDate(new Date()),
          data: {
            ...item.feedItem.data,
            lastMessage,
          },
        };

        // Sort feedItems by updatedAt in descending order
        feedItems.sort((a, b) => {
          const dateA = a?.feedItem?.updatedAt.toDate().getTime();
          const dateB = b?.feedItem?.updatedAt.toDate().getTime();
          return dateB - dateA; // Sort in descending order
        });

        const firstDocTimestamp = feedItems[0]?.feedItem?.updatedAt || null;
        const lastDocTimestamp =
          feedItems[feedItems.length - 1]?.feedItem?.updatedAt || null;

        nextState.feedItems[commonId] = {
          ...nextState.feedItems[commonId],
          data: feedItems,
          firstDocTimestamp,
          lastDocTimestamp,
        };
      }
    }),
  )
  .handleAction(actions.setSearchState, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId, state: searchState } = payload;
      nextState.searchState[commonId] = searchState;
    }),
  )
  .handleAction(actions.resetSearchState, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId } = payload;
      nextState.searchState[commonId] = { ...initialSearchState };
    }),
  )
  .handleAction(actions.updateSearchFeedItems, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId, itemIds } = payload;

      // Ensure the searchState for the given commonId is initialized
      if (!nextState.searchState[commonId]) {
        nextState.searchState[commonId] = { ...initialSearchState };
      }

      if (!nextState.searchState[commonId].feedItems) {
        nextState.searchState[commonId].feedItems = [];
      }

      // Get the feedItems for the given commonId
      const feedItems = nextState.feedItems[commonId]?.data || [];

      itemIds.forEach((feedItemEntityId) => {
        const feedItem = feedItems.find(
          (item) =>
            item.feedItem.data.id === feedItemEntityId ||
            item.feedItem.data.discussionId === feedItemEntityId,
        );

        if (feedItem) {
          nextState.searchState[commonId].feedItems!.push(feedItem);
        }
      });
    }),
  )
  .handleAction(actions.setIsSearchingFeedItems, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId, isSearching } = payload;

      // Ensure searchState exists for the commonId
      if (!nextState.searchState[commonId]) {
        nextState.searchState[commonId] = { ...initialSearchState };
      }

      nextState.searchState[commonId].isSearching = isSearching;
    }),
  )
  .handleAction(actions.setFeedState, (state, { payload }) =>
    produce(state, (nextState) => {
      const {
        commonId,
        data: { feedItems, pinnedFeedItems, sharedFeedItem },
        sharedFeedItemId,
      } = payload;

      // Initialize feedItems and pinnedFeedItems for the commonId if not already present
      if (!nextState.feedItems[commonId]) {
        nextState.feedItems[commonId] = { ...initialFeedItems };
      }
      if (!nextState.pinnedFeedItems[commonId]) {
        nextState.pinnedFeedItems[commonId] = { ...initialPinnedFeedItems };
      }

      // Update feedItems
      nextState.feedItems[commonId] = {
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
        loading: false, // Ensure required field
        batchNumber: nextState.feedItems[commonId].batchNumber || 0, // Preserve or initialize
      };

      // Update pinnedFeedItems
      nextState.pinnedFeedItems[commonId] = {
        ...pinnedFeedItems,
        data:
          pinnedFeedItems.data &&
          pinnedFeedItems.data.map(deserializeFeedItemFollowLayoutItem),
        loading: false, // Ensure required field
      };

      // Handle sharedFeedItem logic
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
        nextState.feedItems[commonId].data = data;
      }

      // Remove sharedFeedItemId from feedItems and pinnedFeedItems
      if (sharedFeedItemId) {
        nextState.feedItems[commonId].data =
          nextState.feedItems[commonId].data &&
          nextState.feedItems[commonId]?.data.filter(
            (item) => item.itemId !== sharedFeedItemId,
          );
        nextState.pinnedFeedItems[commonId].data =
          nextState.pinnedFeedItems[commonId].data &&
          nextState.pinnedFeedItems[commonId].data.filter(
            (item) => item.itemId !== sharedFeedItemId,
          );
      }
    }),
  )

  .handleAction(actions.unpinFeedItems, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId, itemIds } = payload;

      // Ensure the pinnedFeedItems and feedItems for the commonId are initialized
      if (!nextState.pinnedFeedItems[commonId]) {
        nextState.pinnedFeedItems[commonId] = { ...initialPinnedFeedItems };
      }
      if (!nextState.feedItems[commonId]) {
        nextState.feedItems[commonId] = { ...initialFeedItems };
      }

      const removedItems: FeedItemFollowLayoutItem[] = [];

      itemIds.forEach((itemId) => {
        const removedItem = updatePinnedFeedItemInList(nextState, commonId, {
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
        commonId,
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
  .handleAction(actions.resetFeedItems, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId } = payload;

      // Reset the feed items for the given commonId
      if (nextState.feedItems[commonId]) {
        nextState.feedItems[commonId] = { ...initialFeedItems };
      }

      // Reset the pinned feed items for the given commonId
      if (nextState.pinnedFeedItems[commonId]) {
        nextState.pinnedFeedItems[commonId] = { ...initialPinnedFeedItems };
      }

      // Reset the shared feed item for the given commonId
      if (nextState.sharedFeedItem[commonId]) {
        nextState.sharedFeedItem[commonId] = null;
      }
    }),
  )
  .handleAction(actions.setIsNewProjectCreated, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId, isCreated } = payload;

      // Ensure the isNewProjectCreated map is initialized
      if (!nextState.isNewProjectCreated) {
        nextState.isNewProjectCreated = {};
      }

      // Set the value for the specific commonId
      nextState.isNewProjectCreated[commonId] = isCreated;
    }),
  )
  .handleAction(actions.setSharedFeedItemId, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId, sharedFeedItemId } = payload;

      // Ensure sharedFeedItemIds map is initialized
      if (!nextState.sharedFeedItem) {
        nextState.sharedFeedItemId = {};
      }

      // Set the sharedFeedItemId for the given commonId
      nextState.sharedFeedItemId[commonId] = sharedFeedItemId;
    }),
  )
  .handleAction(actions.setRecentStreamId, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.recentStreamId = payload;
    }),
  )
  .handleAction(actions.setRecentAssignedCircleByMember, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId, memberId, circle } = payload;

      // Ensure the recentAssignedCircleByMember map for the commonId exists
      if (!nextState.recentAssignedCircleByMember[commonId]) {
        nextState.recentAssignedCircleByMember[commonId] = {};
      }

      // Update the circle for the given memberId within the commonId
      nextState.recentAssignedCircleByMember[commonId][memberId] = circle;
    }),
  )
  .handleAction(
    actions.resetRecentAssignedCircleByMember,
    (state, { payload }) =>
      produce(state, (nextState) => {
        const { commonId } = payload;

        // Reset the recentAssignedCircleByMember for the specific commonId
        if (nextState.recentAssignedCircleByMember[commonId]) {
          nextState.recentAssignedCircleByMember[commonId] = {};
        }
      }),
  );
