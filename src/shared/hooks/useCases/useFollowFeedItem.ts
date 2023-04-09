import { useCallback, useRef, useState } from "react";
import {
  CancelTokenSource,
  FeedItemFollowsService,
  isRequestCancelled,
  getCancelTokenSource,
  Logger,
} from "@/services";
import { FollowFeedItemPayload } from "@/shared/interfaces/api";

interface Return {
  isFollowingInProgress: boolean;
  isFollowingFinished: boolean;
  followFeedItem: (data: FollowFeedItemPayload) => void;
}

export const useFollowFeedItem = (): Return => {
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const [isFollowingInProgress, setIsFollowingInProgress] = useState(false);
  const [isFollowingFinished, setIsFollowingFinished] = useState(false);

  const followFeedItem = useCallback(async (data: FollowFeedItemPayload) => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel();
    }

    try {
      setIsFollowingInProgress(true);
      setIsFollowingFinished(false);
      cancelTokenRef.current = getCancelTokenSource();

      await FeedItemFollowsService.followFeedItem(data, {
        cancelToken: cancelTokenRef.current.token,
      });

      cancelTokenRef.current = null;
      setIsFollowingFinished(true);
      setIsFollowingInProgress(false);
    } catch (error) {
      if (!isRequestCancelled(error)) {
        Logger.error(error);
        cancelTokenRef.current = null;
        setIsFollowingInProgress(false);
      }
    }
  }, []);

  return {
    isFollowingInProgress,
    isFollowingFinished,
    followFeedItem,
  };
};
