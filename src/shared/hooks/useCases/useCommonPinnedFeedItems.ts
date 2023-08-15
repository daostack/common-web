import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePreviousDistinct } from "react-use";
import difference from "lodash/difference";
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
  const previousIdsForListening = usePreviousDistinct(idsForListening);

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

    const unpinnedIds =
      (previousIdsForListening &&
        difference(previousIdsForListening, idsForListening)) ||
      [];

    if (unpinnedIds.length > 0) {
      dispatch(commonActions.unpinFeedItems(unpinnedIds));
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
