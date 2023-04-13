import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { CommonFeedService } from "@/services";
import { commonActions } from "@/store/states";

export const useFeedItemSubscription = (
  feedItemId: string,
  commonId?: string,
): void => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!commonId) {
      return;
    }

    const unsubscribe = CommonFeedService.subscribeToCommonFeedItem(
      commonId,
      feedItemId,
      (item, isRemoved) => {
        dispatch(
          commonActions.updateFeedItem({
            item,
            isRemoved,
          }),
        );
      },
    );

    return unsubscribe;
  }, [dispatch, feedItemId, commonId]);
};
