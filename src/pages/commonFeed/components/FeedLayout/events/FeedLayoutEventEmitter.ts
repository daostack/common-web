import { EventEmitter } from "eventemitter3";

export enum FeedLayoutEvent {
  ActiveFeedItemUpdated = "active-feed-item-updated",
  ExpandedFeedItemUpdated = "expanded-feed-item-updated",
}

export interface FeedLayoutEventToListener {
  [FeedLayoutEvent.ActiveFeedItemUpdated]: (
    activeFeedItemId: string | null,
  ) => void;
  [FeedLayoutEvent.ExpandedFeedItemUpdated]: (
    expandedFeedItemId: string | null,
  ) => void;
}

class FeedLayoutEventEmitter extends EventEmitter<FeedLayoutEventToListener> {}

export default new FeedLayoutEventEmitter();
