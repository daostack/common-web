import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePreviousDistinct } from "react-use";
import { difference } from "lodash-es";
import { CommonFeedService } from "@/services";
import {
  commonActions,
  PinnedFeedItems,
  selectFilteredPinnedFeedItems,
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
  const filteredPinnedFeedItems = useSelector(selectFilteredPinnedFeedItems);
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

  useEffect(() => {
    return () => {
      dispatch(
        commonActions.getPinnedFeedItems.cancel(
          "Cancel pinned feed items fetch on unmount",
        ),
      );
    };
  }, []);

  return {
    ...pinnedFeedItems,
    data: filteredPinnedFeedItems || pinnedFeedItems.data,
    fetch,
  };
};
