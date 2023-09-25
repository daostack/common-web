import { useCallback, useEffect } from "react";
import { FeedItemFollowsService } from "@/services";
import { useIsMounted, useLoadingState } from "@/shared/hooks";
import { LoadingState } from "@/shared/interfaces";
import { FeedItemFollow } from "@/shared/models";

type State = LoadingState<FeedItemFollow | null>;

interface Data {
  userId?: string;
  feedItemId?: string;
}

interface Options {
  withSubscription?: boolean;
}

interface Return extends State {
  fetchUserFeedItemFollowData: (userId: string, feedItemId: string) => void;
  setUserFeedItemFollowData: (data: FeedItemFollow | null) => void;
}

export const useUserFeedItemFollowData = (
  data: Data,
  options: Options = {},
): Return => {
  const { feedItemId, userId } = data;
  const { withSubscription = false } = options;
  const isMounted = useIsMounted();
  const [state, setState] = useLoadingState<FeedItemFollow | null>(null);

  const fetchUserFeedItemFollowData = useCallback(
    async (userId: string, feedItemId: string) => {
      setState({
        loading: true,
        fetched: false,
        data: null,
      });

      let data: FeedItemFollow | null = null;

      try {
        data = await FeedItemFollowsService.getUserFeedItemFollowData(
          userId,
          feedItemId,
        );
      } catch (error) {
        data = null;
      } finally {
        if (isMounted()) {
          setState({
            loading: false,
            fetched: true,
            data,
          });
        }
      }
    },
    [],
  );

  const setUserFeedItemFollowData = useCallback(
    (data: FeedItemFollow | null) => {
      setState({
        loading: false,
        fetched: true,
        data,
      });
    },
    [],
  );

  useEffect(() => {
    if (!withSubscription || !feedItemId || !userId) {
      return;
    }

    const unsubscribe =
      FeedItemFollowsService.subscribeToUserFeedItemFollowData(
        userId,
        feedItemId,
        (userFeedItemFollowData, { isAdded, isModified }) => {
          let data: State["data"] = null;

          if (isAdded || isModified) {
            data = userFeedItemFollowData;
          }

          setState({
            loading: false,
            fetched: true,
            data,
          });
        },
      );

    return unsubscribe;
  }, [withSubscription, feedItemId, userId]);

  return {
    ...state,
    fetchUserFeedItemFollowData,
    setUserFeedItemFollowData,
  };
};
