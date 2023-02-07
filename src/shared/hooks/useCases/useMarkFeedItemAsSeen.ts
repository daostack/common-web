import { useCallback, useRef, useState } from "react";
import {
  CancelTokenSource,
  CommonFeedService,
  isRequestCancelled,
  getCancelTokenSource,
  Logger,
} from "@/services";
import { MarkCommonFeedItemAsSeenPayload } from "@/shared/interfaces";

interface Return {
  isFeedItemMarkingAsSeen: boolean;
  markFeedItemAsSeen: (payload: MarkCommonFeedItemAsSeenPayload) => void;
}

export const useMarkFeedItemAsSeen = (): Return => {
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const [isFeedItemMarkingAsSeen, setIsFeedItemMarkingAsSeen] = useState(false);

  const markFeedItemAsSeen = useCallback(
    async (payload: MarkCommonFeedItemAsSeenPayload) => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel();
      }

      try {
        setIsFeedItemMarkingAsSeen(true);
        cancelTokenRef.current = getCancelTokenSource();

        await CommonFeedService.markCommonFeedItemAsSeen(payload, {
          cancelToken: cancelTokenRef.current.token,
        });

        cancelTokenRef.current = null;
        setIsFeedItemMarkingAsSeen(false);
      } catch (error) {
        if (!isRequestCancelled(error)) {
          Logger.error(error);
          cancelTokenRef.current = null;
          setIsFeedItemMarkingAsSeen(false);
        }
      }
    },
    [],
  );

  return {
    isFeedItemMarkingAsSeen,
    markFeedItemAsSeen,
  };
};
