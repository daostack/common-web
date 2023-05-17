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
    if (!idsForListening || idsForListening.length === 0) {
      return;
    }

    const unsubscribe = CommonFeedService.subscribeToNewUpdatedCommonFeedItems(
      { commonId, idsForListening },
      (data) => {
        if (data.length > 0) {
          dispatch(commonActions.addNewPinnedFeedItems(data));
        }
      },
    );

    return unsubscribe;
  }, [commonId, idsForListening]);

  return {
    ...pinnedFeedItems,
    fetch,
  };
};
