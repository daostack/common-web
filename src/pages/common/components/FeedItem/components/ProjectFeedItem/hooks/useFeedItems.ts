import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { CommonFeedService, Logger } from "@/services";
import { InboxItemType } from "@/shared/constants";
import { FeedItemFollowLayoutItem, LoadingState } from "@/shared/interfaces";
import {
  CirclesPermissions,
  Common,
  CommonFeed,
  CommonMember,
} from "@/shared/models";
import { sortFeedItemFollowLayoutItems } from "@/shared/utils";
import { FeedItems, selectFeedStateByCommonId } from "@/store/states";
import * as actions from "@/store/states/cache/actions";
import { getFeedLayoutItemDateForSorting } from "@/store/states/inbox/utils";

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
  const dispatch = useDispatch();
  const currentLoadingIdRef = useRef("");
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: [],
  });
  const feedState = useSelector(selectFeedStateByCommonId(commonId));

  const updateCachedFeedState = (
    feedItemsForUpdate: FeedItemFollowLayoutItem[],
    pinnedFeedItems: Common["pinnedFeedItems"],
  ) => {
    const feedItemsData = feedItemsForUpdate.filter(
      (item) =>
        !pinnedFeedItems.some(
          (pinnedItem) => pinnedItem.feedObjectId === item.feedItem.id,
        ),
    );
    const pinnedFeedItemsData = feedItemsForUpdate.filter((item) =>
      pinnedFeedItems.some(
        (pinnedItem) => pinnedItem.feedObjectId === item.feedItem.id,
      ),
    );
    const feedItems: FeedItems = {
      data: feedItemsData,
      loading: false,
      hasMore: true,
      firstDocTimestamp: feedItemsForUpdate?.[0]
        ? getFeedLayoutItemDateForSorting(feedItemsForUpdate[0])
        : null,
      lastDocTimestamp: feedItemsForUpdate?.[feedItemsForUpdate.length - 1]
        ? getFeedLayoutItemDateForSorting(
            feedItemsForUpdate[feedItemsForUpdate.length - 1],
          )
        : null,
      batchNumber: 1,
    };

    dispatch(
      actions.updateFeedStateByCommonId({
        commonId,
        state: {
          feedItems,
          pinnedFeedItems: {
            data: pinnedFeedItemsData,
            loading: false,
          },
          sharedFeedItem: null,
        },
      }),
    );
  };

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
      const { data, pinnedFeedItems } =
        await CommonFeedService.getCommonFeedItemsByUpdatedAt(
          commonId,
          userId,
          {
            commonMember,
            limit: ITEMS_LIMIT,
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

        if (cachedFeedItems.length < convertedData.length) {
          updateCachedFeedState(convertedData, pinnedFeedItems);
        }
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
