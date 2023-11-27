import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonFeedService } from "@/services";
import { commonActions, FeedItems, selectFeedItems } from "@/store/states";

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
  const feedItems = useSelector(selectFeedItems);
  const idsForNotListeningRef = useRef<string[]>(idsForNotListening || []);

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
    if (!feedItems.firstDocTimestamp) {
      return;
    }

    const unsubscribe = CommonFeedService.subscribeToNewUpdatedCommonFeedItems(
      {
        commonId,
        endBefore: feedItems.firstDocTimestamp,
      },
      (data) => {
        if (data.length === 0) {
          return;
        }

        const finalData =
          idsForNotListeningRef.current.length > 0
            ? data.filter(
                (item) =>
                  !idsForNotListeningRef.current.includes(
                    item.commonFeedItem.id,
                  ),
              )
            : data;

        dispatch(commonActions.addNewFeedItems(finalData));
      },
    );

    return unsubscribe;
  }, [feedItems.firstDocTimestamp, commonId]);

  useEffect(() => {
    return () => {
      dispatch(
        commonActions.getFeedItems.cancel("Cancel feed items fetch on unmount"),
      );
    };
  }, []);

  return {
    ...feedItems,
    fetch,
  };
};
