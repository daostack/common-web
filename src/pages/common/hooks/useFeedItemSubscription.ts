import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { CommonFeedService } from "@/services";
import { CommonFeed } from "@/shared/models";

export const useFeedItemSubscription = (
  feedItemId: string,
  commonId?: string,
  callback?: (item: CommonFeed, isRemoved: boolean) => void,
): void => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!commonId || !callback) {
      return;
    }

    const unsubscribe = CommonFeedService.subscribeToCommonFeedItem(
      commonId,
      feedItemId,
      callback,
    );

    return unsubscribe;
  }, [dispatch, feedItemId, commonId, callback]);
};
