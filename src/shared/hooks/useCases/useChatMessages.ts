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
  updateChatMessage: (chatMessage: ChatMessage) => void;
  deleteChatMessage: (chatMessageId: string) => void;
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
    setState((currentState) => {
      const nextData = currentState.data ? [...currentState.data] : [];
      const messageIndex = nextData.findIndex(
        (item) => item.id === chatMessage.id,
      );

      if (messageIndex === -1) {
        nextData.push(chatMessage);
      } else {
        nextData[messageIndex] = { ...chatMessage };
      }

      return {
        ...currentState,
        data: nextData,
      };
    });
  }, []);

  const updateChatMessage = useCallback((chatMessage: ChatMessage) => {
    setState((currentState) => {
      if (!currentState.data) {
        return currentState;
      }

      const data = [...currentState.data];
      const messageIndex = data.findIndex((item) => item.id === chatMessage.id);

      if (messageIndex !== -1) {
        data[messageIndex] = { ...chatMessage };
      }

      return {
        ...currentState,
        data,
      };
    });
  }, []);

  const deleteChatMessage = useCallback((chatMessageId: string) => {
    setState((currentState) => {
      if (!currentState.data) {
        return currentState;
      }

      return {
        ...currentState,
        data: currentState.data.filter((item) => item.id !== chatMessageId),
      };
    });
  }, []);

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
    updateChatMessage,
    deleteChatMessage,
  };
};
