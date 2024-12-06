import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonFeedService } from "@/services";
import {
  commonActions,
  FeedItems,
  optimisticActions,
  selectFeedItems,
  selectFilteredFeedItems,
  selectOptimisticFeedItems,
} from "@/store/states";

interface Return
  extends Pick<FeedItems, "data" | "loading" | "hasMore" | "batchNumber"> {
  fetch: (feedItemId?: string) => void;
}

export const useCommonFeedItems = (
  commonId: string,
  idsForNotListening?: string[],
  sharedFeedItemId?: string | null,
): Return => {
  const dispatch = useDispatch();
  const feedItems = useSelector(selectFeedItems(commonId));
  const filteredFeedItems = useSelector(selectFilteredFeedItems(commonId));
  const optimisticFeedItems = useSelector(selectOptimisticFeedItems);
  const idsForNotListeningRef = useRef<string[]>(idsForNotListening || []);
  const isSubscriptionAllowed = feedItems.data !== null;

  const fetch = (feedItemId?: string) => {
    dispatch(
      commonActions.getFeedItems.request({
        commonId,
        sharedFeedItemId,
        feedItemId,
        limit: 15,
      }),
    );
  };

  useEffect(() => {
    idsForNotListeningRef.current = idsForNotListening || [];
  }, [idsForNotListening]);

  useEffect(() => {
    if (!isSubscriptionAllowed) {
      return;
    }

    const endBefore = feedItems.firstDocTimestamp || undefined;

    const unsubscribe = CommonFeedService.subscribeToNewUpdatedCommonFeedItems(
      { commonId, endBefore },
      (data) => {
        if (data.length === 0) {
          return;
        }

        // TODO: HERE I can get optFeedItem by discussionId
        const optItemIds = Array.from(optimisticFeedItems.values()).map(
          (item) => {
            return item.feedItem.data.id;
          },
        );

        data.forEach((item) => {
          const discussionId =
            item.commonFeedItem.data.discussionId ??
            item.commonFeedItem.data.id;
          if (optItemIds.includes(discussionId)) {
            dispatch(
              optimisticActions.removeOptimisticFeedItemState({
                id: discussionId,
              }),
            );
          }
        });

        const finalData =
          idsForNotListeningRef.current.length > 0
            ? data.filter(
                (item) =>
                  !idsForNotListeningRef.current.includes(
                    item.commonFeedItem.id,
                  ),
              )
            : data;

        dispatch(commonActions.addNewFeedItems({ items: finalData, commonId }));
      },
    );

    return unsubscribe;
  }, [
    isSubscriptionAllowed,
    feedItems.firstDocTimestamp,
    commonId,
    optimisticFeedItems,
  ]);

  useEffect(() => {
    return () => {
      dispatch(commonActions.getFeedItems.cancel({ commonId }));
    };
  }, [commonId]);

  return {
    ...feedItems,
    data: filteredFeedItems || feedItems.data,
    fetch,
  };
};
