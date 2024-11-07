import produce from "immer";
import { WritableDraft } from "immer/dist/types/types-external";
import { pick } from "lodash";
import { ActionType, createReducer } from "typesafe-actions";
import { InboxItemType, QueryParamKey } from "@/shared/constants";
import {
  checkIsChatChannelLayoutItem,
  checkIsFeedItemFollowLayoutItem,
  FeedItemFollowLayoutItemWithFollowData,
  FeedLayoutItemWithFollowData,
} from "@/shared/interfaces";
import { ChatChannel, CommonFeed, Timestamp } from "@/shared/models";
import { areTimestampsEqual } from "@/shared/utils";
import { getQueryParam } from "@/shared/utils/queryParams";
import * as actions from "./actions";
import { InboxItems, InboxSearchState, InboxState, LastState } from "./types";
import { getFeedLayoutItemDateForSorting } from "./utils";

type Action = ActionType<typeof actions>;

const INITIAL_SEARCH_STATE: InboxSearchState = {
  isSearching: false,
  searchValue: "",
  items: null,
};

export const INITIAL_INBOX_ITEMS: InboxItems = {
  data: null,
  loading: false,
  hasMore: false,
  firstDocTimestamp: null,
  lastDocTimestamp: null,
  batchNumber: 0,
  unread: getQueryParam(QueryParamKey.Unread) === "true",
};

export const INITIAL_INBOX_STATE: InboxState = {
  items: { ...INITIAL_INBOX_ITEMS },
  searchState: { ...INITIAL_SEARCH_STATE },
  sharedFeedItemId: null,
  sharedItem: null,
  chatChannelItems: [],
  nextChatChannelItemId: null,
  lastReadState: null,
  lastUnreadState: null,
};

const sortInboxItems = (data: FeedLayoutItemWithFollowData[]): void => {
  data.sort(
    (prevItem, nextItem) =>
      getFeedLayoutItemDateForSorting(nextItem).seconds -
      getFeedLayoutItemDateForSorting(prevItem).seconds,
  );
};

const getDocTimestamps = (
  data: FeedLayoutItemWithFollowData[],
): {
  firstDocTimestamp: Timestamp | null;
  lastDocTimestamp: Timestamp | null;
} => ({
  firstDocTimestamp: data[0] ? getFeedLayoutItemDateForSorting(data[0]) : null,
  lastDocTimestamp: data[data.length - 1]
    ? getFeedLayoutItemDateForSorting(data[data.length - 1])
    : null,
});

const updateInboxItemInList = (
  state: WritableDraft<InboxState>,
  payload: {
    item: FeedLayoutItemWithFollowData;
    isRemoved?: boolean;
  },
): void => {
  if (!state.items.data) {
    return;
  }

  const { item: updatedItem } = payload;
  const isRemoved =
    payload.isRemoved ||
    (checkIsFeedItemFollowLayoutItem(updatedItem) &&
      updatedItem.feedItem.isDeleted);
  const itemIndex = state.items.data?.findIndex(
    (item) =>
      item.type === updatedItem.type && item.itemId === updatedItem.itemId,
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
      ...updatedItem,
    };
    sortInboxItems(nextData);
  }
  const { firstDocTimestamp, lastDocTimestamp } = getDocTimestamps(nextData);

  state.items = {
    ...state.items,
    data: nextData,
  };

  if (!areTimestampsEqual(state.items.firstDocTimestamp, firstDocTimestamp)) {
    state.items.firstDocTimestamp = firstDocTimestamp;
  }

  if (!areTimestampsEqual(state.items.lastDocTimestamp, lastDocTimestamp)) {
    state.items.lastDocTimestamp = lastDocTimestamp;
  }
};

const updateInboxItemInChatChannelItems = (
  state: WritableDraft<InboxState>,
  payload: {
    item: FeedLayoutItemWithFollowData;
    isRemoved?: boolean;
  },
): void => {
  const { item: updatedItem, isRemoved } = payload;

  if (
    state.chatChannelItems.length === 0 ||
    !checkIsChatChannelLayoutItem(updatedItem)
  ) {
    return;
  }

  const itemIndex = state.chatChannelItems.findIndex(
    (item) => item.itemId === updatedItem.itemId,
  );

  if (itemIndex === -1) {
    return;
  }

  const nextData = [...state.chatChannelItems];

  if (isRemoved) {
    nextData.splice(itemIndex, 1);
  } else {
    nextData[itemIndex] = {
      ...nextData[itemIndex],
      ...updatedItem,
    };
  }

  state.chatChannelItems = nextData;
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

  const { item: updatedFeedItem } = payload;
  const isRemoved = payload.isRemoved || updatedFeedItem.isDeleted;
  const itemIndex = state.items.data?.findIndex(
    (item) =>
      item.type === InboxItemType.FeedItemFollow &&
      item.itemId === updatedFeedItem.id,
  );

  if (itemIndex === -1) {
    return;
  }

  const nextData = [...state.items.data];

  if (isRemoved) {
    nextData.splice(itemIndex, 1);
    state.items = {
      ...state.items,
      data: nextData,
    };
    return;
  }

  const itemByIndex = nextData[itemIndex];

  if (itemByIndex.type !== InboxItemType.FeedItemFollow) {
    return;
  }

  const newFeedItem = {
    ...itemByIndex.feedItem,
    ...updatedFeedItem,
  };
  nextData[itemIndex] = {
    ...itemByIndex,
    feedItem: { ...newFeedItem },
    feedItemFollowWithMetadata: {
      ...itemByIndex.feedItemFollowWithMetadata,
      feedItem: { ...newFeedItem },
    },
  };
  sortInboxItems(nextData);
  const { firstDocTimestamp, lastDocTimestamp } = getDocTimestamps(nextData);

  state.items = {
    ...state.items,
    data: nextData,
  };

  if (!areTimestampsEqual(state.items.firstDocTimestamp, firstDocTimestamp)) {
    state.items.firstDocTimestamp = firstDocTimestamp;
  }

  if (!areTimestampsEqual(state.items.lastDocTimestamp, lastDocTimestamp)) {
    state.items.lastDocTimestamp = lastDocTimestamp;
  }
};

const updateSharedInboxItem = (
  state: WritableDraft<InboxState>,
  payload: {
    item: FeedLayoutItemWithFollowData;
    isRemoved?: boolean;
  },
): void => {
  const { item: updatedItem } = payload;
  const isRemoved =
    payload.isRemoved ||
    (checkIsFeedItemFollowLayoutItem(updatedItem) &&
      updatedItem.feedItem.isDeleted);

  if (
    state.sharedItem?.type !== updatedItem.type ||
    state.sharedItem?.itemId !== updatedItem.itemId
  ) {
    return;
  }

  if (isRemoved) {
    state.sharedItem = null;
    state.sharedFeedItemId = null;
  } else {
    state.sharedItem = {
      ...state.sharedItem,
      ...updatedItem,
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
  const { item: updatedFeedItem } = payload;
  const isRemoved = payload.isRemoved || updatedFeedItem.isDeleted;

  if (
    state.sharedItem?.type !== InboxItemType.FeedItemFollow ||
    state.sharedItem?.itemId !== updatedFeedItem.id
  ) {
    return;
  }

  if (isRemoved) {
    state.sharedItem = null;
    state.sharedFeedItemId = null;

    return;
  }

  const newFeedItem = {
    ...state.sharedItem.feedItem,
    ...updatedFeedItem,
  };
  state.sharedItem = {
    ...state.sharedItem,
    feedItem: { ...newFeedItem },
    feedItemFollowWithMetadata: {
      ...state.sharedItem.feedItemFollowWithMetadata,
      feedItem: { ...newFeedItem },
    },
  };
};

const updateChatChannelItemInInboxItem = (
  state: WritableDraft<InboxState>,
  payload: {
    item: Partial<ChatChannel> & { id: string };
    isRemoved?: boolean;
  },
): void => {
  if (!state.items.data) {
    return;
  }

  const { item: updatedChatChannelItem, isRemoved } = payload;
  const itemIndex = state.items.data?.findIndex(
    (item) =>
      checkIsChatChannelLayoutItem(item) &&
      item.itemId === updatedChatChannelItem.id,
  );

  if (itemIndex === -1) {
    return;
  }

  const nextData = [...state.items.data];

  if (isRemoved) {
    nextData.splice(itemIndex, 1);
    state.items = {
      ...state.items,
      data: nextData,
    };
    return;
  }

  const itemByIndex = nextData[itemIndex];

  if (itemByIndex.type !== InboxItemType.ChatChannel) {
    return;
  }

  nextData[itemIndex] = {
    ...itemByIndex,
    chatChannel: {
      ...itemByIndex.chatChannel,
      ...updatedChatChannelItem,
      lastMessage: updatedChatChannelItem.lastMessage || undefined,
    },
  };
  sortInboxItems(nextData);
  const { firstDocTimestamp, lastDocTimestamp } = getDocTimestamps(nextData);

  state.items = {
    ...state.items,
    data: nextData,
  };

  if (!areTimestampsEqual(state.items.firstDocTimestamp, firstDocTimestamp)) {
    state.items.firstDocTimestamp = firstDocTimestamp;
  }

  if (!areTimestampsEqual(state.items.lastDocTimestamp, lastDocTimestamp)) {
    state.items.lastDocTimestamp = lastDocTimestamp;
  }
};

const updateChatChannelItemInChatChannelItem = (
  state: WritableDraft<InboxState>,
  payload: {
    item: Partial<ChatChannel> & { id: string };
    isRemoved?: boolean;
  },
): void => {
  if (state.chatChannelItems.length === 0) {
    return;
  }

  const { item: updatedChatChannelItem, isRemoved } = payload;
  const itemIndex = state.chatChannelItems.findIndex(
    (item) => item.itemId === updatedChatChannelItem.id,
  );

  if (itemIndex === -1) {
    return;
  }

  const nextData = [...state.chatChannelItems];

  if (isRemoved) {
    nextData.splice(itemIndex, 1);
    state.chatChannelItems = nextData;
    return;
  }

  const itemByIndex = nextData[itemIndex];
  nextData[itemIndex] = {
    ...itemByIndex,
    chatChannel: {
      ...itemByIndex.chatChannel,
      ...updatedChatChannelItem,
      lastMessage: updatedChatChannelItem.lastMessage || undefined,
    },
  };
  state.chatChannelItems = nextData;
};

const updateChatChannelItemInSharedInboxItem = (
  state: WritableDraft<InboxState>,
  payload: {
    item: Partial<ChatChannel> & { id: string };
    isRemoved?: boolean;
  },
): void => {
  const { item: updatedChatChannelItem, isRemoved } = payload;

  if (
    state.sharedItem?.type !== InboxItemType.ChatChannel ||
    state.sharedItem?.itemId !== updatedChatChannelItem.id
  ) {
    return;
  }

  if (isRemoved) {
    state.sharedItem = null;
    state.sharedFeedItemId = null;

    return;
  }

  state.sharedItem = {
    ...state.sharedItem,
    chatChannel: {
      ...state.sharedItem.chatChannel,
      ...updatedChatChannelItem,
      lastMessage: updatedChatChannelItem.lastMessage || undefined,
    },
  };
};

const updateChatChannelItem = (
  state: WritableDraft<InboxState>,
  payload: {
    item: Partial<ChatChannel> & { id: string };
    isRemoved?: boolean;
  },
): void => {
  updateChatChannelItemInInboxItem(state, payload);
  updateChatChannelItemInChatChannelItem(state, payload);
  updateChatChannelItemInSharedInboxItem(state, payload);
};

// Add type guard to check if an item is of type `FeedItemFollowLayoutItemWithFollowData`
function isFeedItemFollowLayoutItemWithFollowData(
  item: FeedLayoutItemWithFollowData
): item is FeedItemFollowLayoutItemWithFollowData {
  return (item as FeedItemFollowLayoutItemWithFollowData).feedItemFollowWithMetadata !== undefined;
}

export const reducer = createReducer<InboxState, Action>(INITIAL_INBOX_STATE)
  .handleAction(actions.resetInbox, (state, { payload }) => {
    if (payload?.onlyIfUnread && !state.items.unread) {
      return state;
    }

    return { ...INITIAL_INBOX_STATE };
  })
  .handleAction(actions.getInboxItems.request, (state, { payload }) =>
    produce(state, (nextState) => {
      const { unread = false, shouldUseLastStateIfExists = false } = payload;
      const lastState = unread
        ? nextState.lastUnreadState
        : nextState.lastReadState;

      if (!shouldUseLastStateIfExists || !lastState) {
        nextState.items = {
          ...nextState.items,
          loading: true,
        };
        return;
      }

      nextState.items = lastState.items;
      nextState.sharedFeedItemId = lastState.sharedFeedItemId;
      nextState.sharedItem = lastState.sharedItem;
      nextState.chatChannelItems = lastState.chatChannelItems;
      nextState.nextChatChannelItemId = lastState.nextChatChannelItemId;
    }),
  )
  .handleAction(actions.getInboxItems.success, (state, { payload }) =>
    produce(state, (nextState) => {
      const payloadData = nextState.sharedFeedItemId
        ? payload.data &&
          payload.data.filter(
            (item) => item.itemId !== nextState.sharedFeedItemId,
          )
        : payload.data;

      nextState.items = {
        ...payload,
        data: payloadData && (nextState.items.data || []).concat(payloadData),
        loading: false,
        batchNumber: nextState.items.batchNumber + 1,
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
  .handleAction(actions.addNewInboxItems, (state, action) =>
    produce(state, (nextState) => {
      const payload = action.payload.filter(
        (item) =>
          item.item.itemId !== state.sharedItem?.itemId &&
          !nextState.chatChannelItems.some(
            (chatChannelItem) => chatChannelItem.itemId === item.item.itemId,
          ),
      );
      const data = payload.reduceRight((acc, { item, statuses }) => {
        const nextData = [...acc];
        const itemIndex = nextData.findIndex(
          (nextDataItem) =>
            nextDataItem.type === item.type &&
            nextDataItem.itemId === item.itemId,
        );
        const isRemoved =
          statuses.isRemoved ||
          (checkIsFeedItemFollowLayoutItem(item) && item.feedItem.isDeleted);

        if (isRemoved) {
          if (itemIndex >= 0) {
            nextData.splice(itemIndex, 1);
          }

          return nextData;
        }

        const finalItem: FeedLayoutItemWithFollowData = { ...item };

        if (itemIndex < 0) {
          return [finalItem, ...nextData];
        }

        nextData[itemIndex] = finalItem;

        return nextData;
      }, nextState.items.data || []);
      sortInboxItems(data);
      const { firstDocTimestamp, lastDocTimestamp } = getDocTimestamps(data);

      nextState.items = {
        ...nextState.items,
        data,
      };

      if (
        !areTimestampsEqual(
          nextState.items.firstDocTimestamp,
          firstDocTimestamp,
        )
      ) {
        nextState.items.firstDocTimestamp = firstDocTimestamp;
      }

      if (
        !areTimestampsEqual(nextState.items.lastDocTimestamp, lastDocTimestamp)
      ) {
        nextState.items.lastDocTimestamp = lastDocTimestamp;
      }
    }),
  )
  .handleAction(actions.setSearchState, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.searchState = payload;
    }),
  )
  .handleAction(actions.resetSearchState, (state) =>
    produce(state, (nextState) => {
      nextState.searchState = { ...INITIAL_SEARCH_STATE };
    }),
  )
  .handleAction(actions.resetSearchInboxItems, (state) =>
    produce(state, (nextState) => {
      nextState.searchState.items = null;
    }),
  )
  .handleAction(actions.updateSearchInboxItems, (state, { payload }) =>
    produce(state, (nextState) => {
      if (!nextState.searchState.items) {
        nextState.searchState.items = [];
      }

      const searchItemIds = nextState.searchState.items.map(
        ({ itemId }) => itemId,
      );

      payload.forEach((feedItemEntityId) => {
        const feedItem = nextState.items.data?.find((item) =>
          checkIsChatChannelLayoutItem(item)
            ? item.itemId === feedItemEntityId
            : item.feedItem.data.id === feedItemEntityId ||
              item.feedItem.data.discussionId === feedItemEntityId,
        );

        if (feedItem && !searchItemIds.includes(feedItem.itemId)) {
          nextState.searchState.items!.push(feedItem);
        }
      });
    }),
  )
  .handleAction(actions.setIsSearchingInboxItems, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.searchState.isSearching = payload;
    }),
  )
  .handleAction(actions.updateInboxItem, (state, { payload }) =>
    produce(state, (nextState) => {
      updateInboxItemInList(nextState, payload);
      updateInboxItemInChatChannelItems(nextState, payload);
      updateSharedInboxItem(nextState, payload);
    }),
  )
  .handleAction(actions.updateFeedItem, (state, { payload }) =>
    produce(state, (nextState) => {
      updateFeedItemInInboxItem(nextState, payload);
      updateFeedItemInSharedInboxItem(nextState, payload);
    }),
  )
  .handleAction(actions.updateChatChannelItem, (state, { payload }) =>
    produce(state, (nextState) => {
      updateChatChannelItem(nextState, payload);
    }),
  )
  .handleAction(actions.updateChatChannelItemEmptiness, (state, { payload }) =>
    produce(state, (nextState) => {
      const foundItem =
        state.items.data?.find(
          (item) =>
            checkIsChatChannelLayoutItem(item) && item.itemId === payload.id,
        ) ||
        state.chatChannelItems.find((item) => item.itemId === payload.id) ||
        (checkIsChatChannelLayoutItem(state.sharedItem) &&
        state.sharedItem.itemId === payload.id
          ? state.sharedItem
          : null);

      if (
        checkIsChatChannelLayoutItem(foundItem) &&
        ((foundItem.chatChannel.messageCount === 0 && !payload.becameEmpty) ||
          (foundItem.chatChannel.messageCount > 0 && payload.becameEmpty))
      ) {
        updateChatChannelItem(nextState, {
          item: {
            ...foundItem.chatChannel,
            messageCount: payload.becameEmpty ? 0 : 1,
          },
        });
      }
    }),
  )
  .handleAction(actions.resetInboxItems, (state) =>
    produce(state, (nextState) => {
      nextState.items = { ...INITIAL_INBOX_ITEMS };
      nextState.sharedFeedItemId = null;
      nextState.sharedItem = null;
      nextState.chatChannelItems = [];
      nextState.nextChatChannelItemId = null;
    }),
  )
  .handleAction(actions.setHasMoreInboxItems, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.items.hasMore = payload;
    }),
  )
  .handleAction(actions.setSharedFeedItemId, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.sharedFeedItemId = payload;
    }),
  )
  .handleAction(actions.setSharedInboxItem, (state, { payload }) =>
    produce(state, (nextState) => {
      const sharedItem = payload && { ...payload };

      nextState.sharedItem = sharedItem;

      if (sharedItem && nextState.items.data) {
        nextState.items = {
          ...nextState.items,
          data: nextState.items.data.filter(
            (item) => item.itemId !== sharedItem.itemId,
          ),
        };
      }
    }),
  )
  .handleAction(actions.addChatChannelItem, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.chatChannelItems = [
        {
          type: InboxItemType.ChatChannel,
          itemId: payload.id,
          chatChannel: { ...payload },
        },
        ...nextState.chatChannelItems.filter(
          (item) => item.chatChannel.messageCount !== 0,
        ),
      ];
      nextState.nextChatChannelItemId = payload.id;

      if (!payload) {
        return;
      }
      if (
        nextState.sharedItem?.type === InboxItemType.ChatChannel &&
        nextState.sharedItem.itemId === payload.id
      ) {
        nextState.sharedFeedItemId = null;
        nextState.sharedItem = null;
        return;
      }

      nextState.items = {
        ...nextState.items,
        data:
          nextState.items.data &&
          nextState.items.data.filter(
            (item) =>
              item.type !== InboxItemType.ChatChannel ||
              item.itemId !== payload.id,
          ),
      };
    }),
  )
  .handleAction(
    actions.removeEmptyChatChannelItems,
    (state, { payload: nextActiveItemId }) =>
      produce(state, (nextState) => {
        if (nextState.nextChatChannelItemId !== nextActiveItemId) {
          nextState.nextChatChannelItemId = null;
        }

        const hasItemToRemove = nextState.chatChannelItems.some(
          (item) =>
            item.chatChannel.messageCount === 0 &&
            item.itemId !== nextActiveItemId,
        );

        if (hasItemToRemove) {
          nextState.chatChannelItems = nextState.chatChannelItems.filter(
            (item) =>
              item.chatChannel.messageCount !== 0 ||
              item.itemId === nextActiveItemId,
          );
        }
      }),
  )
  .handleAction(actions.saveLastState, (state, { payload }) =>
    produce(state, (nextState) => {
      const { shouldSaveAsReadState } = payload;
      const stateToSave: LastState = pick(nextState, [
        "items",
        "sharedFeedItemId",
        "sharedItem",
        "chatChannelItems",
        "nextChatChannelItemId",
      ]);
      const data = stateToSave.items.data || [];
      stateToSave.items = {
        ...stateToSave.items,
        loading: false,
        hasMore: true,
        firstDocTimestamp:
          (data[0] && getFeedLayoutItemDateForSorting(data[0])) || null,
        lastDocTimestamp:
          (data[data.length - 1] &&
            getFeedLayoutItemDateForSorting(data[data.length - 1])) ||
          null,
        batchNumber: data.length > 15 ? stateToSave.items.batchNumber : 2,
      };

      if (shouldSaveAsReadState) {
        nextState.lastReadState = stateToSave;
      } else {
        nextState.lastUnreadState = stateToSave;
      }
    }),
  )
  .handleAction(actions.setInboxItemUpdatedAt, (state, { payload }) =>
    produce(state, (nextState) => {
      const feedItemId = payload.feedItemId;
  
      const updatedFeedItemIndex = nextState.items.data?.findIndex(
        feedItem => feedItem.itemId === feedItemId
      ) ?? -1;
  
      if (updatedFeedItemIndex !== -1 && nextState.items.data) {
        const item = nextState.items.data[updatedFeedItemIndex];
  
        if (isFeedItemFollowLayoutItemWithFollowData(item)) {
          item.feedItem = {
            ...item.feedItem,
            updatedAt: Timestamp.fromDate(new Date()),
            data: {
              ...item.feedItem.data,
              lastMessage: payload.lastMessage,
            }
          };
  
          // Sort `nextState.items.data` by `updatedAt` in descending order
          nextState.items.data.sort((a, b) => {
            const dateA = isFeedItemFollowLayoutItemWithFollowData(a)
              ? a.feedItem.updatedAt.toDate().getTime()
              : 0; // Use 0 for items without updatedAt
            const dateB = isFeedItemFollowLayoutItemWithFollowData(b)
              ? b.feedItem.updatedAt.toDate().getTime()
              : 0; // Use 0 for items without updatedAt
            return dateB - dateA; // Sort in descending order
          });
        }
      }
    })
  );
