import { useCallback } from "react";
import { ChatService, Logger } from "@/services";

interface ReactToChatMessageParams {
  emoji: string;
  chatMessageId: string;
  chatChannelId: string;
}

interface Return {
  reactToChatMessage: (params: ReactToChatMessageParams) => void;
  removeChatMessageReaction: (
    chatMessageId: string,
    chatChannelId: string,
  ) => void;
}

export const useChatMessageReaction = (): Return => {
  const reactToChatMessage = useCallback(
    async (params: ReactToChatMessageParams) => {
      try {
        await ChatService.createMessageReaction(params);
      } catch (error) {
        Logger.error(error);
      }
    },
    [],
  );

  const removeChatMessageReaction = useCallback(
    async (chatMessageId: string, chatChannelId: string) => {
      try {
        await ChatService.deleteMessageReaction({
          chatMessageId,
          chatChannelId,
        });
      } catch (error) {
        Logger.error(error);
      }
    },
    [],
  );

  return {
    reactToChatMessage,
    removeChatMessageReaction,
  };
};
