import { useCallback, useState } from "react";
import { FeedItemFollowsService } from "@/services";
import { InboxItemType } from "@/shared/constants";
import { CombinedState, State } from "./types";

interface FetchInboxDataOptions {
  sharedFeedItemId?: string | null;
}

interface Return extends CombinedState {
  fetchInboxData: (options: FetchInboxDataOptions) => void;
  resetInboxData: () => void;
}

export const useInboxData = (userId?: string): Return => {
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: null,
  });
  const isLoading = state.loading;
  const isFetched = state.fetched;

  const fetchInboxData = useCallback(
    (options: FetchInboxDataOptions) => {
      const { sharedFeedItemId } = options;
      setState({
        loading: true,
        fetched: false,
        data: null,
      });

      (async () => {
        try {
          const sharedInboxItem =
            userId && sharedFeedItemId
              ? await FeedItemFollowsService.getUserFeedItemFollowDataWithMetadata(
                  userId,
                  sharedFeedItemId,
                )
              : null;

          setState({
            loading: false,
            fetched: true,
            data: {
              sharedInboxItem: sharedInboxItem && {
                type: InboxItemType.FeedItemFollow,
                itemId: sharedInboxItem.feedItemId,
                feedItem: sharedInboxItem.feedItem,
                feedItemFollowWithMetadata: sharedInboxItem,
              },
            },
          });
        } catch (error) {
          setState({
            loading: false,
            fetched: true,
            data: null,
          });
        }
      })();
    },
    [userId],
  );

  const resetInboxData = useCallback(() => {
    setState({
      loading: false,
      fetched: false,
      data: null,
    });
  }, []);

  return {
    loading: isLoading,
    fetched: isFetched,
    data: state.data,
    fetchInboxData,
    resetInboxData,
  };
};
