import { useDispatch, useSelector } from "react-redux";
import {
  commonActions,
  PinnedFeedItems,
  selectPinnedFeedItems,
} from "@/store/states";

interface Return extends Pick<PinnedFeedItems, "data" | "loading"> {
  fetch: () => void;
}

export const useCommonPinnedFeedItems = (commonId: string): Return => {
  const dispatch = useDispatch();
  const pinnedFeedItems = useSelector(selectPinnedFeedItems);

  const fetch = () => {
    dispatch(
      commonActions.getPinnedFeedItems.request({
        commonId,
      }),
    );
  };

  return {
    ...pinnedFeedItems,
    fetch,
  };
};
