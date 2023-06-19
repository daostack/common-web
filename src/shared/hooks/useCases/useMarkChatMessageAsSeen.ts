import { useCallback, useRef, useState } from "react";
import {
  CancelTokenSource,
  isRequestCancelled,
  getCancelTokenSource,
  Logger,
  ChatService,
} from "@/services";

interface MarkChatMessageAsSeenOptions {
  chatChannelId?: string;
  chatMessageId?: string;
}

interface Return {
  isChatMessageMarkingAsSeen: boolean;
  markChatMessageAsSeen: (options?: MarkChatMessageAsSeenOptions) => void;
}

export const useMarkChatMessageAsSeen = (): Return => {
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const [isChatMessageMarkingAsSeen, setIsChatMessageMarkingAsSeen] =
    useState(false);

  const markChatMessageAsSeen = useCallback(
    async (options: MarkChatMessageAsSeenOptions = {}) => {
      const { chatChannelId, chatMessageId } = options;

      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel();
      }

      try {
        setIsChatMessageMarkingAsSeen(true);
        cancelTokenRef.current = getCancelTokenSource();
        const endpointOptions = {
          cancelToken: cancelTokenRef.current.token,
        };

        if (chatMessageId) {
          await ChatService.markChatMessageAsSeen(
            chatMessageId,
            endpointOptions,
          );
        } else if (chatChannelId) {
          await ChatService.markChatChannelAsSeen(
            chatChannelId,
            endpointOptions,
          );
        }

        cancelTokenRef.current = null;
        setIsChatMessageMarkingAsSeen(false);
      } catch (error) {
        if (!isRequestCancelled(error)) {
          Logger.error(error);
          cancelTokenRef.current = null;
          setIsChatMessageMarkingAsSeen(false);
        }
      }
    },
    [],
  );

  return {
    isChatMessageMarkingAsSeen,
    markChatMessageAsSeen,
  };
};
