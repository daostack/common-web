import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Logger, ChatService, UserService } from "@/services";
import { LoadingState } from "@/shared/interfaces";
import { ChatMessage } from "@/shared/models";
import { getUserName } from "@/shared/utils";
import {
  cacheActions,
  selectChatChannelMessagesStateByChatChannelId,
} from "@/store/states";

interface Return extends LoadingState<ChatMessage[]> {
  fetchChatMessages: (chatChannelId: string) => void;
  addChatMessage: (chatMessage: ChatMessage) => void;
  updateChatMessage: (chatMessage: ChatMessage) => void;
  deleteChatMessage: (chatMessageId: string) => void;
  isBatchLoading: boolean;
}

const DEFAULT_STATE: LoadingState<ChatMessage[]> = {
  loading: false,
  fetched: false,
  data: [],
};

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
        createdAt: parentMessage.createdAt,
      },
    };
  });

export const useChatMessages = (currentChatChannelId: string): Return => {
  const dispatch = useDispatch();
  const state =
    useSelector(
      selectChatChannelMessagesStateByChatChannelId(currentChatChannelId),
    ) || DEFAULT_STATE;

  const fetchChatMessages = useCallback(async (chatChannelId: string) => {
    try {
      const fetchedChatMessages = (
        await ChatService.getChatMessages({
          chatChannelId,
          limit: null,
          sortingDirection: "asc",
        })
      ).chatMessages;
      const chatChannelMessages = addParentMessageToMessages(
        await addOwnersToMessages(fetchedChatMessages),
      );

      dispatch(
        cacheActions.setChatChannelMessagesStateByChatChannelId({
          chatChannelId,
          chatChannelMessages,
        }),
      );
    } catch (error) {
      Logger.error(error);
      dispatch(
        cacheActions.setChatChannelMessagesStateByChatChannelId({
          chatChannelId,
          chatChannelMessages: [],
        }),
      );
    }
  }, []);

  const addChatMessage = useCallback((chatChannelMessage: ChatMessage) => {
    dispatch(
      cacheActions.addChatChannelMessageByChatChannelId({
        chatChannelId: chatChannelMessage.chatChannelId,
        chatChannelMessage,
      }),
    );
  }, []);

  const updateChatMessage = useCallback((chatChannelMessage: ChatMessage) => {
    dispatch(
      cacheActions.updateChatChannelMessages({
        chatChannelId: chatChannelMessage.chatChannelId,
        updatedChatChannelMessages: [chatChannelMessage],
      }),
    );
  }, []);

  const deleteChatMessage = useCallback(
    (chatChannelMessageId: string) => {
      dispatch(
        cacheActions.updateChatChannelMessages({
          chatChannelId: currentChatChannelId,
          removedChatChannelMessageIds: [chatChannelMessageId],
        }),
      );
    },
    [currentChatChannelId],
  );

  useEffect(() => {
    if (!currentChatChannelId) {
      return;
    }

    const unsubscribe = ChatService.subscribeToChatChannelMessages(
      currentChatChannelId,
      async (fetchedMessages) => {
        const updatedMessages = fetchedMessages
          .filter(({ statuses }) => !statuses.isRemoved)
          .map(({ message }) => message);
        const updatedMessagesWithOwners = await addOwnersToMessages(
          updatedMessages,
        );
        const removedChatChannelMessageIds = fetchedMessages.reduce<string[]>(
          (acc, { message, statuses }) =>
            statuses.isRemoved ? [...acc, message.id] : acc,
          [],
        );

        dispatch(
          cacheActions.updateChatChannelMessages({
            chatChannelId: currentChatChannelId,
            updatedChatChannelMessages: addParentMessageToMessages(
              updatedMessagesWithOwners,
            ),
            removedChatChannelMessageIds,
          }),
        );
      },
    );

    return unsubscribe;
  }, [currentChatChannelId]);

  return {
    ...state,
    loading: !state.fetched,
    fetchChatMessages,
    addChatMessage,
    updateChatMessage,
    deleteChatMessage,
    isBatchLoading: state.loading,
  };
};
