import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { CommonFeedService } from "@/services";
import { commonActions } from "@/store/states";

export const useFeedItemSubscription = (
  commonId: string,
  feedItemId: string,
): void => {
  const dispatch = useDispatch();

  useEffect(() => {
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
  }, [dispatch]);
};
