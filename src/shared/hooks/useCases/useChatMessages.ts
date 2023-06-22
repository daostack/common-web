import { useCallback, useEffect, useRef } from "react";
import {
  CancelTokenSource,
  isRequestCancelled,
  getCancelTokenSource,
  Logger,
  ChatService,
  UserService,
} from "@/services";
import { useLoadingState } from "@/shared/hooks";
import { LoadingState } from "@/shared/interfaces";
import { ChatMessage } from "@/shared/models";
import { getUserName } from "@/shared/utils";

interface Return extends LoadingState<ChatMessage[]> {
  fetchChatMessages: (chatChannelId: string) => void;
  addChatMessage: (chatMessage: ChatMessage) => void;
  updateChatMessage: (chatMessage: ChatMessage) => void;
  deleteChatMessage: (chatMessageId: string) => void;
}

const addOwnersToMessages = async (
  chatMessages: ChatMessage[],
): Promise<ChatMessage[]> => {
  const newChatMessages = [...chatMessages];
  const ownerIds = Array.from(
    new Set(newChatMessages.map((message) => message.ownerId)),
  );
  const owners = await UserService.getCachedUsersById(ownerIds);

  return newChatMessages.map((message) => ({
    ...message,
    owner: owners.find((owner) => owner.uid === message.ownerId),
  }));
};

const addParentMessageToMessages = (
  chatMessages: ChatMessage[],
): ChatMessage[] =>
  chatMessages.map((message) => {
    const parentMessage =
      (message.parentId &&
        chatMessages.find(({ id }) => id === message.parentId)) ||
      null;

    return {
      ...message,
      parentMessage: parentMessage && {
        id: parentMessage.id,
        ownerName: getUserName(parentMessage.owner) || parentMessage.ownerName,
        ownerId: parentMessage.ownerId,
        text: parentMessage.text,
        images: parentMessage.images,
        files: parentMessage.files,
      },
    };
  });

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

      const fetchedChatMessages = await ChatService.getChatMessages(
        chatChannelId,
        {
          cancelToken: cancelTokenRef.current.token,
        },
      );
      const chatMessages = addParentMessageToMessages(
        await addOwnersToMessages(fetchedChatMessages),
      );

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
      async (fetchedMessages) => {
        const messagesWithOwners = await addOwnersToMessages(
          fetchedMessages.map(({ message }) => message),
        );
        const messages = messagesWithOwners.map((message, index) => ({
          ...fetchedMessages[index],
          message,
        }));

        setState((currentState) => {
          if (!currentState.data) {
            return currentState;
          }

          const newMessages: ChatMessage[] = [];
          const nextData = [...currentState.data];
          messages.forEach(({ message, statuses: { isRemoved } }) => {
            const messageIndex = nextData.findIndex(
              (item) => item.id === message.id,
            );

            if (messageIndex === -1) {
              if (!isRemoved) {
                newMessages.push(message);
              }
              return;
            }

            if (isRemoved) {
              nextData.splice(messageIndex, 1);
            } else {
              nextData[messageIndex] = message;
            }
          });
          nextData.push(...newMessages);

          return {
            ...currentState,
            data: addParentMessageToMessages(nextData),
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
