import { useCallback, useState } from "react";
import { CommonFeedService, Logger } from "@/services";
import { MarkCommonFeedItemAsSeenPayload } from "@/shared/interfaces";

interface Return {
  isFeedItemMarkingAsSeen: boolean;
  markFeedItemAsSeen: (payload: MarkCommonFeedItemAsSeenPayload) => void;
}

export const useMarkFeedItemAsSeen = (): Return => {
  const [isFeedItemMarkingAsSeen, setIsFeedItemMarkingAsSeen] = useState(false);

  const markFeedItemAsSeen = useCallback(
    async (payload: MarkCommonFeedItemAsSeenPayload) => {
      try {
        setIsFeedItemMarkingAsSeen(true);
        await CommonFeedService.markCommonFeedItemAsSeen(payload);
      } catch (error) {
        Logger.error(error);
      } finally {
        setIsFeedItemMarkingAsSeen(false);
      }
    },
    [],
  );

  return {
    isFeedItemMarkingAsSeen,
    markFeedItemAsSeen,
  };
};
