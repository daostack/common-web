import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonFeedService } from "@/services";
import { commonActions, FeedItems, selectFeedItems } from "@/store/states";

interface Return extends Pick<FeedItems, "data" | "loading" | "hasMore"> {
  fetch: () => void;
}

export const useCommonFeedItems = (commonId: string): Return => {
  const dispatch = useDispatch();
  const feedItems = useSelector(selectFeedItems);

  const fetch = () => {
    dispatch(
      commonActions.getFeedItems.request({
        commonId,
        limit: 50,
      }),
    );
  };

  useEffect(() => {
    if (!feedItems.firstDocSnapshot) {
      return;
    }

    const unsubscribe = CommonFeedService.subscribeToNewCommonFeedItems(
      commonId,
      feedItems.firstDocSnapshot,
      (data) => {
        if (data.length > 0) {
          dispatch(commonActions.addNewFeedItems(data));
        }
      },
    );

    return unsubscribe;
  }, [feedItems.firstDocSnapshot]);

  return {
    ...feedItems,
    fetch,
  };
};
