import { useCallback } from "react";
import { DiscussionMessageService, Logger } from "@/services";

interface ReactToDiscussionMessageParams {
  emoji: string;
  discussionMessageId: string;
}

interface Return {
  reactToDiscussionMessage: (params: ReactToDiscussionMessageParams) => void;
}

export const useDiscussionMessageReaction = (): Return => {
  const reactToDiscussionMessage = useCallback(
    async (params: ReactToDiscussionMessageParams) => {
      try {
        await DiscussionMessageService.createMessageReaction(params);
      } catch (error) {
        Logger.error(error);
      }
    },
    [],
  );

  return {
    reactToDiscussionMessage,
  };
};
