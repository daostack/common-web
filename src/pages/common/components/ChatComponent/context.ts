import { Discussion, Proposal } from "@/shared/models";
import React, { useContext } from "react";

export interface ChatItem {
  proposal?: Proposal;
  discussion: Discussion;
  circleVisibility: string[];
}

export interface ChatContextValue {
  setChatItem: (data: ChatItem) => void;
}

export const ChatContext = React.createContext<ChatContextValue>({
  setChatItem: () => {
      throw new Error("setChatItem is called not from the child of FeedTab");
    },
});

export const useChatContext = (): ChatContextValue => useContext(ChatContext);
