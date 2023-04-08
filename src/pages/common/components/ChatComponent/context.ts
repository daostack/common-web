import React, { useContext } from "react";
import {
  CommonFeedObjectUserUnique,
  Discussion,
  Proposal,
} from "@/shared/models";

export interface ChatItem {
  feedItemId: string;
  proposal?: Proposal;
  discussion: Discussion;
  circleVisibility: string[];
  lastSeenItem?: CommonFeedObjectUserUnique["lastSeen"];
}

export interface ChatContextValue {
  setChatItem: (data: ChatItem | null) => void;
  feedItemIdForAutoChatOpen?: string;
  setIsShowFeedItemDetailsModal?: (isShowing: boolean) => void;
  setShouldShowSeeMore?: (shouldShow: boolean) => void;
}

export const ChatContext = React.createContext<ChatContextValue>({
  setChatItem: () => {
    throw new Error("setChatItem is called not from the child of FeedTab");
  },
  setIsShowFeedItemDetailsModal: () => {
    throw new Error(
      "setIsShowFeedItemDetailsModal is called not from the child of FeedTab",
    );
  },
  setShouldShowSeeMore: () => {
    throw new Error(
      "setShouldShowSeeMore is called not from the child of FeedTab",
    );
  },
});

export const useChatContext = (): ChatContextValue => useContext(ChatContext);
