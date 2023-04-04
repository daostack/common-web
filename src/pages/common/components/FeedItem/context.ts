import React, { useContext } from "react";

export interface FeedItemContextValue {
  activeFeedItemId?: string | null;
  expandedFeedItemId?: string | null;
}

export const FeedItemContext = React.createContext<FeedItemContextValue>({});

export const useFeedItemContext = (): FeedItemContextValue =>
  useContext(FeedItemContext);
