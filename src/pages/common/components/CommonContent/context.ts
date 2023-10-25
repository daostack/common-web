import React, { useContext } from "react";

export interface ChatContentData {
  isScrolling: boolean;
  chatContentRect?: DOMRect;
}

export const ChatContentContext = React.createContext<ChatContentData>({
  isScrolling: false,
});

export const useChatContentContext = (): ChatContentData =>
  useContext(ChatContentContext);
