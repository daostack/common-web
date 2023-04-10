import produce from "immer";
import { WritableDraft } from "immer/dist/types/types-external";
import { ActionType, createReducer } from "typesafe-actions";
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
  sharedItemId: null,
  sharedItem: null,
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
    (item) => item.id === updatedItem.id,
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

  if (state.sharedItem?.id !== updatedItem.id) {
    return;
  }

  if (isRemoved) {
    state.sharedItem = null;
    state.sharedItemId = null;
  } else {
    state.sharedItem = {
      ...state.sharedItem,
      ...updatedItem,
    };
  }
};

export const reducer = createReducer<InboxState, Action>(initialState)
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
      const payloadData = nextState.sharedItemId
        ? payload.data &&
          payload.data.filter((item) => item.id !== nextState.sharedItemId)
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
        (acc, { inboxItem, statuses: { isRemoved } }) => {
          const nextData = [...acc];
          const itemIndex = nextData.findIndex(
            (item) => item.id === inboxItem.id,
          );

          if (isRemoved) {
            if (itemIndex >= 0) {
              nextData.splice(itemIndex, 1);
            }

            return nextData;
          }

          firstDocTimestamp = inboxItem.updatedAt;

          if (itemIndex < 0) {
            return [inboxItem, ...nextData];
          }

          nextData[itemIndex] = inboxItem;

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
  .handleAction(actions.resetInboxItems, (state) =>
    produce(state, (nextState) => {
      nextState.items = { ...initialInboxItems };
    }),
  )
  .handleAction(actions.setSharedInboxItemId, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.sharedItemId = payload;
    }),
  )
  .handleAction(actions.setSharedInboxItem, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.sharedItem = payload;
    }),
  );
