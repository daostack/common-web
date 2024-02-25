import { useCallback } from "react";
import { ChatService, Logger } from "@/services";

interface ReactToChatMessageParams {
  emoji: string;
  chatMessageId: string;
  chatChannelId: string;
}

interface Return {
  reactToChatMessage: (params: ReactToChatMessageParams) => void;
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

  return {
    reactToChatMessage,
  };
};
