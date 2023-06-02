import { useCallback, useEffect, useRef } from "react";
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
  addChatMessage: (chatMessage: ChatMessage) => void;
  updateChatMessageWithActualId: (
    pendingMessageId: string,
    chatMessage: ChatMessage,
  ) => void;
}

export const useChatMessages = (): Return => {
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const [state, setState] = useLoadingState<ChatMessage[]>([]);
  const currentChatChannelId = state.data?.[0]?.chatChannelId;

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

  const addChatMessage = useCallback((chatMessage: ChatMessage) => {
    setState((currentState) => ({
      ...currentState,
      data: (currentState.data || []).concat(chatMessage),
    }));
  }, []);

  const updateChatMessageWithActualId = useCallback(
    (pendingMessageId: string, chatMessage: ChatMessage) => {
      setState((currentState) => {
        if (!currentState.data) {
          return currentState;
        }

        const data = [...currentState.data];
        const pendingMessageIndex = data.findIndex(
          (item) => item.id === pendingMessageId,
        );

        if (pendingMessageIndex !== -1) {
          data[pendingMessageIndex] = { ...chatMessage };
        }

        return {
          ...currentState,
          data,
        };
      });
    },
    [],
  );

  useEffect(() => {
    if (!currentChatChannelId) {
      return;
    }

    const unsubscribe = ChatService.subscribeToChatChannelMessages(
      currentChatChannelId,
      (messages) => {
        setState((currentState) => {
          if (!currentState.data) {
            return currentState;
          }

          const newMessages: ChatMessage[] = [];
          const nextData = [...currentState.data];
          messages.forEach((message) => {
            const messageIndex = nextData.findIndex(
              (item) => item.id === message.id,
            );

            if (messageIndex === -1) {
              newMessages.push(message);
            } else {
              nextData[messageIndex] = message;
            }
          });
          nextData.push(...newMessages);

          return {
            ...currentState,
            data: nextData,
          };
        });
      },
    );

    return unsubscribe;
  }, [currentChatChannelId]);

  return {
    ...state,
    fetchChatMessages,
    addChatMessage,
    updateChatMessageWithActualId,
  };
};
