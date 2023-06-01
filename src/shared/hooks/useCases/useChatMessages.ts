import { useCallback, useRef } from "react";
import {
  CancelTokenSource,
  isRequestCancelled,
  getCancelTokenSource,
  Logger,
  ChatService,
} from "@/services";
import { useLoadingState } from "@/shared/hooks";
import { LoadingState } from "@/shared/interfaces";
import { ChatMessage } from "@/shared/models";

interface Return extends LoadingState<ChatMessage[]> {
  fetchChatMessages: (chatChannelId: string) => void;
}

export const useChatMessages = (): Return => {
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const [state, setState] = useLoadingState<ChatMessage[]>([]);

  const fetchChatMessages = useCallback(async (chatChannelId: string) => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel();
    }

    try {
      setState({
        loading: true,
        fetched: false,
        data: [],
      });
      cancelTokenRef.current = getCancelTokenSource();

      const chatMessages = await ChatService.getChatMessages(chatChannelId, {
        cancelToken: cancelTokenRef.current.token,
      });

      cancelTokenRef.current = null;
      setState({
        loading: false,
        fetched: true,
        data: chatMessages,
      });
    } catch (error) {
      if (!isRequestCancelled(error)) {
        Logger.error(error);
        cancelTokenRef.current = null;
        setState({
          loading: false,
          fetched: false,
          data: [],
        });
      }
    }
  }, []);

  return {
    ...state,
    fetchChatMessages,
  };
};
