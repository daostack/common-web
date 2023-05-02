import produce from "immer";
import { WritableDraft } from "immer/dist/types/types-external";
import { ActionType, createReducer } from "typesafe-actions";
import { FeedLayoutItemWithFollowData } from "@/pages/commonFeed";
import { CommonFeed, FeedItemFollowWithMetadata } from "@/shared/models";
import * as actions from "./actions";
import { InboxState, InboxItems } from "./types";

type Action = ActionType<typeof actions>;

const initialInboxItems: InboxItems = {
  data: null,
  loading: false,
  hasMore: false,
  firstDocTimestamp: null,
  lastDocTimestamp: null,
};

const initialState: InboxState = {
  items: { ...initialInboxItems },
  sharedFeedItemId: null,
  sharedItem: null,
  follows: {},
};

const updateInboxItemInList = (
  state: WritableDraft<InboxState>,
  payload: {
    item: Partial<FeedItemFollowWithMetadata> & { id: string };
    isRemoved?: boolean;
  },
): void => {
  if (!state.items.data) {
    return;
  }

  const { item: updatedItem, isRemoved = false } = payload;
  const itemIndex = state.items.data?.findIndex(
    (item) => item.feedItemFollowWithMetadata.id === updatedItem.id,
  );

  if (itemIndex === -1) {
    return;
  }

  const nextData = [...state.items.data];

  if (isRemoved) {
    nextData.splice(itemIndex, 1);
  } else {
    nextData[itemIndex] = {
      ...nextData[itemIndex],
      feedItemFollowWithMetadata: {
        ...nextData[itemIndex].feedItemFollowWithMetadata,
        ...updatedItem,
      },
    };
  }

  state.items = {
    ...state.items,
    data: nextData,
  };
};

const updateFeedItemInInboxItem = (
  state: WritableDraft<InboxState>,
  payload: {
    item: Partial<CommonFeed> & { id: string };
    isRemoved?: boolean;
  },
): void => {
  if (!state.items.data) {
    return;
  }

  const { item: updatedFeedItem, isRemoved = false } = payload;
  const itemIndex = state.items.data?.findIndex(
    (item) => item.feedItemFollowWithMetadata.feedItemId === updatedFeedItem.id,
  );

  if (itemIndex === -1) {
    return;
  }

  const nextData = [...state.items.data];

  if (isRemoved) {
    nextData.splice(itemIndex, 1);
  } else {
    const newFeedItem = {
      ...nextData[itemIndex].feedItem,
      ...updatedFeedItem,
    };
    nextData[itemIndex] = {
      feedItem: { ...newFeedItem },
      feedItemFollowWithMetadata: {
        ...nextData[itemIndex].feedItemFollowWithMetadata,
        feedItem: { ...newFeedItem },
      },
    };
  }

  state.items = {
    ...state.items,
    data: nextData,
  };
};

const updateSharedInboxItem = (
  state: WritableDraft<InboxState>,
  payload: {
    item: Partial<FeedItemFollowWithMetadata> & { id: string };
    isRemoved?: boolean;
  },
): void => {
  const { item: updatedItem, isRemoved = false } = payload;

  if (state.sharedItem?.feedItemFollowWithMetadata.id !== updatedItem.id) {
    return;
  }

  if (isRemoved) {
    state.sharedItem = null;
    state.sharedFeedItemId = null;
  } else {
    state.sharedItem = {
      ...state.sharedItem,
      feedItemFollowWithMetadata: {
        ...state.sharedItem.feedItemFollowWithMetadata,
        ...updatedItem,
      },
    };
  }
};

const updateFeedItemInSharedInboxItem = (
  state: WritableDraft<InboxState>,
  payload: {
    item: Partial<CommonFeed> & { id: string };
    isRemoved?: boolean;
  },
): void => {
  const { item: updatedFeedItem, isRemoved = false } = payload;

  if (
    state.sharedItem?.feedItemFollowWithMetadata.feedItemId !==
    updatedFeedItem.id
  ) {
    return;
  }

  if (isRemoved) {
    state.sharedItem = null;
    state.sharedFeedItemId = null;
  } else {
    const newFeedItem = {
      ...state.sharedItem.feedItem,
      ...updatedFeedItem,
    };
    state.sharedItem = {
      feedItem: { ...newFeedItem },
      feedItemFollowWithMetadata: {
        ...state.sharedItem.feedItemFollowWithMetadata,
        feedItem: { ...newFeedItem },
      },
    };
  }
};

export const reducer = createReducer<InboxState, Action>(initialState)
  .handleAction(actions.resetInbox, () => ({ ...initialState }))
  .handleAction(actions.getInboxItems.request, (state) =>
    produce(state, (nextState) => {
      nextState.items = {
        ...nextState.items,
        loading: true,
      };
    }),
  )
  .handleAction(actions.getInboxItems.success, (state, { payload }) =>
    produce(state, (nextState) => {
      const payloadData = nextState.sharedFeedItemId
        ? payload.data &&
          payload.data.filter(
            (item) =>
              item.feedItemFollowWithMetadata.feedItemId !==
              nextState.sharedFeedItemId,
          )
        : payload.data;

      nextState.items = {
        ...payload,
        data: payloadData && (nextState.items.data || []).concat(payloadData),
        loading: false,
      };
    }),
  )
  .handleAction(actions.getInboxItems.failure, (state) =>
    produce(state, (nextState) => {
      nextState.items = {
        ...nextState.items,
        loading: false,
        hasMore: false,
        lastDocTimestamp: null,
      };
    }),
  )
  .handleAction(actions.addNewInboxItems, (state, { payload }) =>
    produce(state, (nextState) => {
      let firstDocTimestamp = nextState.items.firstDocTimestamp;

      const data = payload.reduceRight(
        (acc, { item, statuses: { isRemoved } }) => {
          const nextData = [...acc];
          const itemIndex = nextData.findIndex(
            (nextDataItem) =>
              nextDataItem.feedItemFollowWithMetadata.id === item.id,
          );

          if (isRemoved) {
            if (itemIndex >= 0) {
              nextData.splice(itemIndex, 1);
            }

            return nextData;
          }

          const finalItem: FeedLayoutItemWithFollowData = {
            feedItem: item.feedItem,
            feedItemFollowWithMetadata: item,
          };
          firstDocTimestamp = item.updatedAt;

          if (itemIndex < 0) {
            return [finalItem, ...nextData];
          }

          nextData[itemIndex] = finalItem;

          return nextData;
        },
        nextState.items.data || [],
      );

      nextState.items = {
        ...nextState.items,
        data,
        firstDocTimestamp,
      };
    }),
  )
  .handleAction(actions.updateInboxItem, (state, { payload }) =>
    produce(state, (nextState) => {
      updateInboxItemInList(nextState, payload);
      updateSharedInboxItem(nextState, payload);
    }),
  )
  .handleAction(actions.updateFeedItem, (state, { payload }) =>
    produce(state, (nextState) => {
      updateFeedItemInInboxItem(nextState, payload);
      updateFeedItemInSharedInboxItem(nextState, payload);
    }),
  )
  .handleAction(actions.resetInboxItems, (state) =>
    produce(state, (nextState) => {
      nextState.items = { ...initialInboxItems };
    }),
  )
  .handleAction(actions.setSharedFeedItemId, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.sharedFeedItemId = payload;
    }),
  )
  .handleAction(actions.setSharedInboxItem, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.sharedItem = payload
        ? {
            feedItem: payload.feedItem,
            feedItemFollowWithMetadata: payload,
          }
        : null;
    }),
  )
  .handleAction(actions.setFeedItemFollow, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.follows[payload.commonId] =
        nextState.follows[payload.commonId] || {};
      nextState.follows[payload.commonId][payload.itemId] = payload.isFollowing;
    }),
  );
