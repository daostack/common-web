import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { CommonFeedService, Logger } from "@/services";
import { FirestoreDataSource, InboxItemType } from "@/shared/constants";
import { FeedItemFollowLayoutItem, LoadingState } from "@/shared/interfaces";
import { CirclesPermissions, CommonFeed, CommonMember } from "@/shared/models";
import { sortFeedItemFollowLayoutItems } from "@/shared/utils";
import { selectFeedStateByCommonId } from "@/store/states";

const ITEMS_LIMIT = 5;

type State = LoadingState<FeedItemFollowLayoutItem[]>;

interface Return extends State {
  fetchFeedItems: () => void;
  onFeedItemUpdate: (item: CommonFeed, isRemoved: boolean) => void;
}

interface Options {
  commonMember?: (CommonMember & CirclesPermissions) | null;
}

export const useFeedItems = (
  commonId: string,
  userId?: string,
  options: Options = {},
): Return => {
  const { commonMember } = options;
  const currentLoadingIdRef = useRef("");
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: [],
  });
  const feedState = useSelector(selectFeedStateByCommonId(commonId));

  const fetchFeedItems = async () => {
    if (state.loading || state.fetched) {
      return;
    }

    const cachedFeedItems = [
      ...(feedState?.feedItems.data || []),
      ...(feedState?.pinnedFeedItems.data || []),
    ];

    if (cachedFeedItems.length > 0) {
      sortFeedItemFollowLayoutItems(cachedFeedItems);
      setState({
        loading: false,
        fetched: true,
        data: cachedFeedItems.slice(0, ITEMS_LIMIT),
      });
    } else {
      setState({
        loading: true,
        fetched: false,
        data: [],
      });
    }

    const loadingId = uuidv4();
    currentLoadingIdRef.current = loadingId;

    try {
      const { data } = await CommonFeedService.getCommonFeedItemsByUpdatedAt(
        commonId,
        userId,
        {
          commonMember,
          limit: ITEMS_LIMIT,
          withoutPinnedItems: false,
          source: FirestoreDataSource.Cache,
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

  useEffect(() => {
    return () => {
      currentLoadingIdRef.current = "";
    };
  }, []);

  return {
    ...state,
    fetchFeedItems,
    onFeedItemUpdate: handleFeedItemUpdate,
  };
};
