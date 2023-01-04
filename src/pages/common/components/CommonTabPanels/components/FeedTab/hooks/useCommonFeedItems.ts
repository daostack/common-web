import { useDispatch, useSelector } from "react-redux";
import { commonActions, FeedItems, selectFeedItems } from "@/store/states";

interface Return extends Omit<FeedItems, "lastDocSnapshot"> {
  fetch: () => void;
}

export const useCommonFeedItems = (commonId: string): Return => {
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

  return {
    ...feedItems,
    fetch,
  };
};
