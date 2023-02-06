import React, { useContext } from "react";
import { Discussion, Proposal } from "@/shared/models";

export interface ChatItem {
  feedItemId: string;
  proposal?: Proposal;
  discussion: Discussion;
  circleVisibility: string[];
}

export interface ChatContextValue {
  setChatItem: (data: ChatItem) => void;
  activeItemDiscussionId?: string;
}

export const ChatContext = React.createContext<ChatContextValue>({
  setChatItem: () => {
    throw new Error("setChatItem is called not from the child of FeedTab");
  },
});

export const useChatContext = (): ChatContextValue => useContext(ChatContext);
