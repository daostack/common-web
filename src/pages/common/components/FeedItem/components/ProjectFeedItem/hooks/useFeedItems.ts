import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { CommonFeedService, Logger } from "@/services";
import { InboxItemType } from "@/shared/constants";
import { FeedItemFollowLayoutItem, LoadingState } from "@/shared/interfaces";

type State = LoadingState<FeedItemFollowLayoutItem[]>;

interface Return extends State {
  fetchFeedItems: () => void;
}

export const useFeedItems = (commonId: string, userId?: string): Return => {
  const currentLoadingIdRef = useRef("");
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: [],
  });

  const fetchFeedItems = async () => {
    if (state.loading || state.fetched) {
      return;
    }

    const loadingId = uuidv4();
    currentLoadingIdRef.current = loadingId;

    try {
      const { data } = await CommonFeedService.getCommonFeedItemsByUpdatedAt(
        commonId,
        userId,
        {
          limit: 5,
          withoutPinnedItems: false,
        },
      );
      const convertedData: FeedItemFollowLayoutItem[] = data.map((item) => ({
        type: InboxItemType.FeedItemFollow,
        itemId: item.id,
        feedItem: item,
      }));

      if (currentLoadingIdRef.current === loadingId) {
        setState({
          loading: false,
          fetched: true,
          data: convertedData,
        });
      }
    } catch (err) {
      if (currentLoadingIdRef.current === loadingId) {
        Logger.error(err);
        setState({
          loading: false,
          fetched: true,
          data: [],
        });
      }
    }
  };

  return {
    ...state,
    fetchFeedItems,
  };
};
