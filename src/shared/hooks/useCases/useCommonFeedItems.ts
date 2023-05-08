import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonFeedService } from "@/services";
import { commonActions, FeedItems, selectFeedItems } from "@/store/states";

interface Return extends Pick<FeedItems, "data" | "loading" | "hasMore"> {
  fetch: () => void;
}

export const useCommonFeedItems = (
  commonId: string,
  idsForNotListening?: string[],
): Return => {
  const dispatch = useDispatch();
  const feedItems = useSelector(selectFeedItems);

  const fetch = () => {
    dispatch(
      commonActions.getFeedItems.request({
        commonId,
        limit: 15,
      }),
    );
  };

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
          idsForNotListening && idsForNotListening.length > 0
            ? data.filter(
                (item) => !idsForNotListening.includes(item.commonFeedItem.id),
              )
            : data;

        dispatch(commonActions.addNewFeedItems(finalData));
      },
    );

    return unsubscribe;
  }, [feedItems.firstDocTimestamp, commonId, idsForNotListening]);

  return {
    ...feedItems,
    fetch,
  };
};
