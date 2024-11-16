import { InboxItemType } from "@/shared/constants";
import produce from "immer";
import { ActionType, createReducer } from "typesafe-actions";
import * as actions from "./actions";
import {
  OptimisticState
} from "./types";
import { generateOptimisticFeedItemFollowWithMetadata } from "@/shared/utils";
import { Timestamp } from "@/shared/models";

type Action = ActionType<typeof actions>;

const initialState: OptimisticState = {
  optimisticFeedItems: new Map(),
  optimisticInboxFeedItems: new Map(),
  optimisticDiscussionMessages: new Map(),
  createdOptimisticFeedItems: new Map(),
  instantDiscussionMessagesOrder: new Map(),
};

export const reducer = createReducer<OptimisticState, Action>(initialState)
  .handleAction(actions.resetOptimisticState, () => initialState)
  .handleAction(actions.setInstantDiscussionMessagesOrder, (state, { payload }) =>
    produce(state, (nextState) => {
      const updatedMap = new Map(nextState.instantDiscussionMessagesOrder);
      const { discussionId } = payload;

      if(updatedMap.size > 1 && updatedMap.has(discussionId)) {
        const keys = Array.from(updatedMap.keys());

        keys.forEach((key) => {
          const orderValue = updatedMap.get(key)?.order || 2;
          const timestampValue = updatedMap.get(key)?.timestamp || Timestamp.fromDate(new Date());
          updatedMap.set(key, {
            order: orderValue === 1 ? 1 : orderValue - 1,
            timestamp: timestampValue
          });
        });
      }

      if(updatedMap.has(discussionId)) {
        updatedMap.set(discussionId, {
          order: updatedMap.size || 1,
          timestamp: Timestamp.fromDate(new Date())
        });
      } else {
        updatedMap.set(discussionId, {
          order: (updatedMap.size + 1) || 1,
          timestamp: Timestamp.fromDate(new Date())
        });
      }
      nextState.instantDiscussionMessagesOrder = updatedMap;
    }),
  )
  .handleAction(actions.clearInstantDiscussionMessagesOrder, (state) =>
    produce(state, (nextState) => {
      const updatedMap = new Map();

      // updatedMap.delete(payload);

      // Assign the new Map back to the state
      nextState.instantDiscussionMessagesOrder = updatedMap;
    }),
  )
  .handleAction(actions.setOptimisticFeedItem, (state, { payload }) =>
    produce(state, (nextState) => {
        const updatedMap = new Map(nextState.optimisticFeedItems);
        const updateMapInbox = new Map(nextState.optimisticInboxFeedItems);

        const optimisticItemId = payload.data.data.discussionId ?? payload.data.data.id;
        // Add the new item to the Map
        updatedMap.set(optimisticItemId, {
          type: InboxItemType.FeedItemFollow,
          itemId: payload.data.id,
          feedItem: payload.data,
        });
        updateMapInbox.set(optimisticItemId, {
          type: InboxItemType.FeedItemFollow,
          itemId: payload.data.id,
          feedItem: payload.data,
          feedItemFollowWithMetadata: generateOptimisticFeedItemFollowWithMetadata({feedItem: payload.data, common: payload.common})
        });
        // Assign the new Map back to the state
        nextState.optimisticFeedItems = updatedMap;
        nextState.optimisticInboxFeedItems = updateMapInbox;
    }),
  )
  .handleAction(actions.updateOptimisticFeedItemState, (state, { payload }) =>
    produce(state, (nextState) => {
      const updatedMap = new Map(nextState.optimisticFeedItems);
      const updateMapInbox = new Map(nextState.optimisticInboxFeedItems);

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

        updateMapInbox.set(payload.id, {
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
      nextState.optimisticInboxFeedItems = updateMapInbox;
    }),
  )
  .handleAction(actions.removeOptimisticFeedItemState, (state, { payload }) =>
    produce(state, (nextState) => {
      const createdOptimisticFeedItemsMap = new Map(nextState.createdOptimisticFeedItems);
      const updatedMap = new Map(nextState.optimisticFeedItems);

      createdOptimisticFeedItemsMap.set(payload.id, updatedMap.get(payload.id));
      updatedMap.delete(payload.id);

      // Assign the new Map back to the state
      nextState.optimisticFeedItems = updatedMap;
      nextState.createdOptimisticFeedItems = createdOptimisticFeedItemsMap;
    }),
  )
  .handleAction(actions.removeOptimisticInboxFeedItemState, (state, { payload }) =>
    produce(state, (nextState) => {
      const updatedMap = new Map(nextState.optimisticInboxFeedItems);
      updatedMap.delete(payload.id);

      // Assign the new Map back to the state
      nextState.optimisticInboxFeedItems = updatedMap;
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
  )
  .handleAction(actions.clearCreatedOptimisticFeedItem, (state, { payload }) =>
    produce(state, (nextState) => {
      const updatedMap = new Map(nextState.createdOptimisticFeedItems);

      updatedMap.delete(payload);

      // Assign the new Map back to the state
      nextState.createdOptimisticFeedItems = updatedMap;
    }),
  );