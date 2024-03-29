import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { CommonFeedService, Logger } from "@/services";
import { InboxItemType } from "@/shared/constants";
import { FeedItemFollowLayoutItem, LoadingState } from "@/shared/interfaces";
import { CommonFeed } from "@/shared/models";
import { sortFeedItemFollowLayoutItems } from "@/shared/utils";

type State = LoadingState<FeedItemFollowLayoutItem[]>;

interface Return extends State {
  fetchFeedItems: () => void;
  onFeedItemUpdate: (item: CommonFeed, isRemoved: boolean) => void;
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

  const handleFeedItemUpdate = (
    updatedItem: CommonFeed,
    isItemRemoved: boolean,
  ) => {
    if (state.data.length === 0) {
      return;
    }

    const isRemoved = isItemRemoved || updatedItem.isDeleted;
    const feedItemIndex = state.data.findIndex(
      (item) => item.feedItem.id === updatedItem.id,
    );

    if (feedItemIndex === -1) {
      return;
    }

    const nextData = [...state.data];

    if (isRemoved) {
      nextData.splice(feedItemIndex, 1);
    } else {
      nextData[feedItemIndex] = {
        ...nextData[feedItemIndex],
        feedItem: {
          ...nextData[feedItemIndex].feedItem,
          ...updatedItem,
        },
      };
      sortFeedItemFollowLayoutItems(nextData);
    }

    setState((prevState) => ({
      ...prevState,
      data: nextData,
    }));
  };

  return {
    ...state,
    fetchFeedItems,
    onFeedItemUpdate: handleFeedItemUpdate,
  };
};
