import { useCallback, useRef, useState } from "react";
import {
  CancelTokenSource,
  isRequestCancelled,
  getCancelTokenSource,
  Logger,
  ChatService,
} from "@/services";

interface Return {
  isChatMessageMarkingAsSeen: boolean;
  markChatMessageAsSeen: (chatMessageId: string) => void;
}

export const useMarkChatMessageAsSeen = (): Return => {
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const [isChatMessageMarkingAsSeen, setIsChatMessageMarkingAsSeen] =
    useState(false);

  const markChatMessageAsSeen = useCallback(async (chatMessageId: string) => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel();
    }

    try {
      setIsChatMessageMarkingAsSeen(true);
      cancelTokenRef.current = getCancelTokenSource();

      await ChatService.markChatMessageAsSeen(chatMessageId, {
        cancelToken: cancelTokenRef.current.token,
      });

      cancelTokenRef.current = null;
      setIsChatMessageMarkingAsSeen(false);
    } catch (error) {
      if (!isRequestCancelled(error)) {
        Logger.error(error);
        cancelTokenRef.current = null;
        setIsChatMessageMarkingAsSeen(false);
      }
    }
  }, []);

  return {
    isChatMessageMarkingAsSeen,
    markChatMessageAsSeen,
  };
};
