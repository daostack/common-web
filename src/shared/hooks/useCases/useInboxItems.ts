import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { Logger, UserService } from "@/services";
import { addMetadataToItemsBatch } from "@/services/utils";
import {
  checkIsFeedItemFollowLayoutItemWithFollowData,
  FeedItemFollowLayoutItemWithFollowData,
  FeedLayoutItemWithFollowData,
  InboxItemBatch,
  InboxItemsBatch as ItemsBatch,
} from "@/shared/interfaces";
import { InboxItem, Timestamp } from "@/shared/models";
import {
  inboxActions,
  InboxItems,
  NewInboxItems,
  optimisticActions,
  selectFilteredInboxItems,
  selectInboxItems,
  selectInstantDiscussionMessagesOrder,
  selectOptimisticInboxFeedItems,
} from "@/store/states";
import { useDeepCompareEffect } from "react-use";

interface Return
  extends Pick<InboxItems, "data" | "loading" | "hasMore" | "batchNumber"> {
  fetch: () => void;
  refetch: () => void;
}

const filterItemsInTheMiddle = (info: {
  fetchedInboxItems: InboxItem[];
  unread: boolean;
  currentData: FeedLayoutItemWithFollowData[] | null;
}): { addedItems: InboxItem[]; removedItems: InboxItem[] } => {
  const { fetchedInboxItems, unread, currentData } = info;
  const newItems = currentData
    ? fetchedInboxItems.filter((fetchedItem) =>
        currentData.every((item) =>
          checkIsFeedItemFollowLayoutItemWithFollowData(item)
            ? item.feedItemFollowWithMetadata.id !== fetchedItem.itemId
            : item.itemId !== fetchedItem.itemId,
        ),
      )
    : fetchedInboxItems;

  if (!unread) {
    return {
      addedItems: newItems,
      removedItems: [],
    };
  }

  const removedItems = fetchedInboxItems.filter(
    (fetchedItem) =>
      !fetchedItem.unread &&
      (currentData || []).some((item) =>
        checkIsFeedItemFollowLayoutItemWithFollowData(item)
          ? item.feedItemFollowWithMetadata.id === fetchedItem.itemId
          : item.itemId === fetchedItem.itemId,
      ),
  );
  const filteredItems = newItems.filter((item) => item.unread);

  return {
    addedItems: filteredItems,
    removedItems,
  };
};

export const useInboxItems = (
  feedItemIdsForNotListening?: string[],
  options?: { unread?: boolean },
): Return => {
  const dispatch = useDispatch();
  const optimisticInboxItems = useSelector(selectOptimisticInboxFeedItems);
  const instantDiscussionMessages = useSelector(
    selectInstantDiscussionMessagesOrder,
  );
  const [newItemsBatches, setNewItemsBatches] = useState<ItemsBatch[]>([]);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Timestamp | null>(null);
  const inboxItems = useSelector(selectInboxItems);
  const filteredInboxItems = useSelector(selectFilteredInboxItems);
  const user = useSelector(selectUser());
  const inboxItemsRef = useRef(inboxItems);
  const userId = user?.uid;
  const unread = options?.unread;
  const lastBatch = newItemsBatches[0];
  inboxItemsRef.current = inboxItems;

  const fetch = () => {
    dispatch(
      inboxActions.getInboxItems.request({
        limit: 15,
        unread,
      }),
    );
  };

  const refetch = useCallback(() => {
    setNewItemsBatches([]);
    dispatch(inboxActions.refetchInboxItems(Boolean(unread)));
  },[unread, setNewItemsBatches]);

  const addNewInboxItems = (
    data: {
      item: InboxItem;
      statuses: {
        isAdded: boolean;
        isRemoved: boolean;
      };
    }[],
  ) => {
    if (data.length === 0) {
      return;
    }

    setNewItemsBatches((currentItems) => [...currentItems, data]);
  };

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const {
          data,
          firstDocTimestamp: startAt,
          lastDocTimestamp: endAt,
          unread,
        } = inboxItems;

        if (!userId || !startAt || !endAt) {
          return;
        }

        const fetchedInboxItems = await UserService.getInboxItems({
          userId,
          startAt,
          endAt,
        });

        if (!isMounted) {
          return;
        }

        const { addedItems, removedItems } = filterItemsInTheMiddle({
          fetchedInboxItems,
          unread,
          currentData: data,
        });
        const addedItemsWithStatuses = addedItems.map((item) => ({
          item,
          statuses: {
            isAdded: false,
            isRemoved: false,
          },
        }));
        const removedItemsWithStatuses = removedItems.map((item) => ({
          item,
          statuses: {
            isAdded: false,
            isRemoved: true,
          },
        }));

        addNewInboxItems([
          ...addedItemsWithStatuses,
          ...removedItemsWithStatuses,
        ]);
      } catch (err) {
        Logger.error(err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [inboxItems.unread]);

  useEffect(() => {
    if (!inboxItems.firstDocTimestamp || !userId) {
      return;
    }

    const unsubscribe = UserService.subscribeToNewInboxItems(
      {
        userId,
        endBefore: inboxItems.firstDocTimestamp,
        unread,
      },
      addNewInboxItems,
    );

    return unsubscribe;
  }, [
    inboxItems.firstDocTimestamp,
    userId,
    feedItemIdsForNotListening,
    unread,
  ]);

  useEffect(() => {
    const endBefore = lastUpdatedAt || inboxItems.firstDocTimestamp;

    if (!endBefore || !userId) {
      return;
    }

    const unsubscribe = UserService.subscribeToNewInboxItems(
      {
        userId,
        endBefore,
        unread,
        orderBy: "updatedAt",
      },
      (data) => {
        const lastDocTimestampSeconds =
          inboxItemsRef.current?.lastDocTimestamp?.seconds;
        const currentInboxData = inboxItemsRef.current?.data;
        const filteredData =
          lastDocTimestampSeconds && currentInboxData
            ? data.filter(
                ({ item }) =>
                  item.itemUpdatedAt.seconds >= lastDocTimestampSeconds &&
                  !currentInboxData.some(
                    (currentItem) => currentItem.itemId === item.itemId,
                  ),
              )
            : [];

        if (data[0]) {
          setLastUpdatedAt(data[0].item.updatedAt);
        }

        addNewInboxItems(filteredData);

        if (filteredData.length !== data.length) {
          dispatch(inboxActions.setHasMoreInboxItems(true));
        }
      },
    );

    return unsubscribe;
  }, [
    inboxItems.firstDocTimestamp,
    lastUpdatedAt,
    userId,
    feedItemIdsForNotListening,
    unread,
  ]);

  const [notListedFeedItems, setNotListedFeedItems] = useState<InboxItemBatch<FeedLayoutItemWithFollowData>[]>([]);

  useDeepCompareEffect(() => {
    if(notListedFeedItems.length > 0 && notListedFeedItems.length === instantDiscussionMessages.size) {
      const updatedFeedItems = notListedFeedItems.map((item) => {
        const itemData = item?.item as FeedItemFollowLayoutItemWithFollowData;
        const feedItemData = itemData.feedItem?.data;
        const messageUpdatedAt = instantDiscussionMessages.get(feedItemData?.discussionId ?? "")?.timestamp || instantDiscussionMessages.get(feedItemData.id)?.timestamp;
        return {
          ...item,
          item: {
            ...itemData,
            feedItem: {
              ...itemData.feedItem,
              updatedAt: messageUpdatedAt,
            }
          }
        }
      }) as NewInboxItems[];

      setNotListedFeedItems([]);
      dispatch(inboxActions.addNewInboxItems(updatedFeedItems));
      dispatch(optimisticActions.clearInstantDiscussionMessagesOrder());
    }

  },[notListedFeedItems, instantDiscussionMessages]);

  useEffect(() => {
    if (!lastBatch || !userId) {
      return;
    }
    if (lastBatch.length === 0) {
      setNewItemsBatches((currentItems) => currentItems.slice(1));
      return;
    }

    let isMounted = true;

    (async () => {
      try {
        const finalData = await addMetadataToItemsBatch(
          userId,
          lastBatch,
          feedItemIdsForNotListening,
        );

        if (finalData.length > 0 && isMounted) {
          const newItems: InboxItemBatch<FeedLayoutItemWithFollowData>[] = [];
          finalData.forEach((item: InboxItemBatch<FeedLayoutItemWithFollowData>) => {
            const itemData = (item.item as FeedItemFollowLayoutItemWithFollowData)?.feedItem?.data;

            if(instantDiscussionMessages.has(itemData?.discussionId ?? "") || instantDiscussionMessages.has(itemData?.id)) {
              setNotListedFeedItems((prev) => [...prev, item]);
            } else {
              newItems.push(item);
            }
            if(optimisticInboxItems.has(itemData.id)) {
              dispatch(optimisticActions.removeOptimisticInboxFeedItemState({id: itemData.id}));
            } else if (itemData?.discussionId && optimisticInboxItems.has(itemData?.discussionId)) {
              dispatch(optimisticActions.removeOptimisticInboxFeedItemState({id: itemData?.discussionId}));
            }
          })

          newItems.length > 0 && dispatch(inboxActions.addNewInboxItems(newItems));
        }
      } catch (error) {
        Logger.error(error);
      } finally {
        setNewItemsBatches((currentItems) => currentItems.slice(1));
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [lastBatch, instantDiscussionMessages]);


  return {
    ...inboxItems,
    data: filteredInboxItems || inboxItems.data,
    fetch,
    refetch,
  };
};
