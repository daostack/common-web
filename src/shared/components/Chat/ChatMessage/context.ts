import { createContext, useContext } from "react";

export interface ChatMessageContextValue {
  isMessageLoading: boolean;
  onCheckboxChange?: (id: string, checked: boolean) => void;
}

export const ChatMessageContext = createContext<ChatMessageContextValue>({
  isMessageLoading: false,
});

export const useChatMessageContext = (): ChatMessageContextValue =>
  useContext(ChatMessageContext);
