import produce from "immer";
import { WritableDraft } from "immer/dist/types/types-external";
import { ActionType, createReducer } from "typesafe-actions";
import { InboxItemType } from "@/shared/constants";
import {
  checkIsChatChannelLayoutItem,
  checkIsFeedItemFollowLayoutItem,
  FeedLayoutItemWithFollowData,
} from "@/shared/interfaces";
import { ChatChannel, CommonFeed, Timestamp } from "@/shared/models";
import * as actions from "./actions";
import { InboxItems, InboxState } from "./types";
import { getFeedLayoutItemDateForSorting } from "./utils";

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
  chatChannelItems: [],
  nextChatChannelItemId: null,
};

const sortInboxItems = (data: FeedLayoutItemWithFollowData[]): void => {
  data.sort(
    (prevItem, nextItem) =>
      getFeedLayoutItemDateForSorting(nextItem).toMillis() -
      getFeedLayoutItemDateForSorting(prevItem).toMillis(),
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
    firstDocTimestamp,
    lastDocTimestamp,
    data: nextData,
  };
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
    firstDocTimestamp,
    lastDocTimestamp,
    data: nextData,
  };
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
    firstDocTimestamp,
    lastDocTimestamp,
    data: nextData,
  };
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
            (item) => item.itemId !== nextState.sharedFeedItemId,
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
  .handleAction(actions.addNewInboxItems, (state, action) =>
    produce(state, (nextState) => {
      const payload = action.payload.filter(
        (item) =>
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
        firstDocTimestamp,
        lastDocTimestamp,
      };
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
      nextState.items = { ...initialInboxItems };
      nextState.sharedFeedItemId = null;
      nextState.sharedItem = null;
      nextState.chatChannelItems = [];
      nextState.nextChatChannelItemId = null;
    }),
  )
  .handleAction(actions.setSharedFeedItemId, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.sharedFeedItemId = payload;
    }),
  )
  .handleAction(actions.setSharedInboxItem, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.sharedItem = payload && { ...payload };
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
  );
