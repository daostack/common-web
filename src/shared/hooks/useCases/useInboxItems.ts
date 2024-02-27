import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { Logger, UserService } from "@/services";
import { addMetadataToItemsBatch } from "@/services/utils";
import {
  checkIsFeedItemFollowLayoutItemWithFollowData,
  InboxItemsBatch as ItemsBatch,
} from "@/shared/interfaces";
import { InboxItem, Timestamp } from "@/shared/models";
import {
  inboxActions,
  InboxItems,
  selectFilteredInboxItems,
  selectInboxItems,
} from "@/store/states";

interface Return
  extends Pick<InboxItems, "data" | "loading" | "hasMore" | "batchNumber"> {
  fetch: () => void;
  refetch: () => void;
}

export const useInboxItems = (
  feedItemIdsForNotListening?: string[],
  options?: { unread?: boolean },
): Return => {
  const dispatch = useDispatch();
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

  const refetch = () => {
    setNewItemsBatches([]);
    dispatch(inboxActions.refetchInboxItems(Boolean(unread)));
  };

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
        } = inboxItems;

        if (!userId || !startAt || !endAt) {
          return;
        }

        const fetchedInboxItems = await UserService.getInboxItems({
          userId,
          startAt,
          endAt,
        });

        if (!isMounted || inboxItemsRef.current.unread) {
          return;
        }

        const filteredItems = data
          ? fetchedInboxItems.filter((fetchedItem) =>
              data.every((item) =>
                checkIsFeedItemFollowLayoutItemWithFollowData(item)
                  ? item.feedItemFollowWithMetadata.id !== fetchedItem.itemId
                  : item.itemId !== fetchedItem.itemId,
              ),
            )
          : fetchedInboxItems;

        addNewInboxItems(
          filteredItems.map((item) => ({
            item,
            statuses: {
              isAdded: false,
              isRemoved: false,
            },
          })),
        );
      } catch (err) {
        Logger.error(err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

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
          dispatch(inboxActions.addNewInboxItems(finalData));
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
  }, [lastBatch]);

  return {
    ...inboxItems,
    data: filteredInboxItems || inboxItems.data,
    fetch,
    refetch,
  };
};
