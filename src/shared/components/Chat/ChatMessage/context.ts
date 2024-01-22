import { createContext, useContext } from "react";

export interface ChatMessageContextValue {
  isMessageLoading: boolean;
  isMessageEditAllowed: boolean;
  onCheckboxChange?: (id: string, checked: boolean) => void;
}

export const ChatMessageContext = createContext<ChatMessageContextValue>({
  isMessageLoading: false,
  isMessageEditAllowed: false,
});

export const useChatMessageContext = (): ChatMessageContextValue =>
  useContext(ChatMessageContext);
