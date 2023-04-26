import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonFeedService } from "@/services";
import {
  commonActions,
  PinnedFeedItems,
  selectPinnedFeedItems,
} from "@/store/states";

interface Return extends Pick<PinnedFeedItems, "data" | "loading"> {
  fetch: () => void;
}

export const useCommonPinnedFeedItems = (
  commonId: string,
  idsForListening?: string[],
): Return => {
  const dispatch = useDispatch();
  const pinnedFeedItems = useSelector(selectPinnedFeedItems);

  const fetch = () => {
    dispatch(
      commonActions.getPinnedFeedItems.request({
        commonId,
      }),
    );
  };

  useEffect(() => {
    const unsubscribe =
      CommonFeedService.subscribeToNewUpdatedCommonPinnedFeedItems(
        commonId,
        (data) => {
          if (data.length === 0) {
            return;
          }

          const finalData =
            idsForListening && idsForListening.length > 0
              ? data.filter((item) =>
                  idsForListening.includes(item.commonFeedItem.id),
                )
              : data;

          dispatch(commonActions.addNewPinnedFeedItems(finalData));
        },
      );

    return unsubscribe;
  }, [commonId, idsForListening]);

  return {
    ...pinnedFeedItems,
    fetch,
  };
};
