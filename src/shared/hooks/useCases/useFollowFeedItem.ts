import { useCallback, useRef, useState } from "react";
import {
  CancelTokenSource,
  FeedItemFollowsService,
  isRequestCancelled,
  getCancelTokenSource,
  Logger,
} from "@/services";
import { FollowFeedItemPayload } from "@/shared/interfaces/api";

interface State {
  isFollowingInProgress: boolean;
  isFollowingFinished: boolean;
  isFollowingFinishedWithError?: boolean;
}

interface Return extends State {
  followFeedItem: (data: FollowFeedItemPayload) => void;
  cancelFeedItemFollowing: () => void;
}

export const useFollowFeedItem = (): Return => {
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const [followingState, setFollowingState] = useState<State>({
    isFollowingInProgress: false,
    isFollowingFinished: false,
  });

  const followFeedItem = useCallback(async (data: FollowFeedItemPayload) => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel();
    }

    try {
      setFollowingState({
        isFollowingInProgress: true,
        isFollowingFinished: false,
      });
      cancelTokenRef.current = getCancelTokenSource();

      await FeedItemFollowsService.followFeedItem(data, {
        cancelToken: cancelTokenRef.current.token,
      });

      cancelTokenRef.current = null;
      setFollowingState({
        isFollowingInProgress: false,
        isFollowingFinished: true,
      });
    } catch (error) {
      if (!isRequestCancelled(error)) {
        Logger.error(error);
        cancelTokenRef.current = null;
        setFollowingState({
          isFollowingInProgress: false,
          isFollowingFinished: false,
          isFollowingFinishedWithError: true,
        });
      }
    }
  }, []);

  const cancelFeedItemFollowing = useCallback(() => {
    if (!cancelTokenRef.current) {
      return;
    }

    cancelTokenRef.current.cancel();
    cancelTokenRef.current = null;
    setFollowingState({
      isFollowingInProgress: false,
      isFollowingFinished: false,
    });
  }, []);

  return {
    ...followingState,
    followFeedItem,
    cancelFeedItemFollowing,
  };
};
