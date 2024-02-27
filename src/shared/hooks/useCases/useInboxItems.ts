import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  ChatService,
  CommonFeedService,
  CommonService,
  FeedItemFollowsService,
  Logger,
  UserService,
} from "@/services";
import { FirestoreDataSource, InboxItemType } from "@/shared/constants";
import {
  ChatChannelLayoutItem,
  checkIsFeedItemFollowLayoutItemWithFollowData,
  FeedLayoutItemWithFollowData,
} from "@/shared/interfaces";
import {
  ChatChannel,
  FeedItemFollow,
  FeedItemFollowWithMetadata,
  InboxItem,
  Timestamp,
} from "@/shared/models";
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

interface ItemBatch<T = InboxItem> {
  item: T;
  statuses: {
    isAdded: boolean;
    isRemoved: boolean;
  };
}

type ItemsBatch = ItemBatch[];

const addMetadataToFeedItemFollowItemsBatch = async (
  batch: ItemBatch<FeedItemFollow>[],
): Promise<ItemBatch<FeedLayoutItemWithFollowData>[]> => {
  const data = await Promise.all(
    batch.map(async ({ item }) => {
      try {
        const [common, feedItem] = await Promise.all([
          CommonService.getCachedCommonById(item.commonId),
          CommonFeedService.getCommonFeedItemById(
            item.commonId,
            item.feedItemId,
          ),
        ]);

        return {
          common,
          feedItem,
        };
      } catch (error) {
        return null;
      }
    }),
  );
  const parentCommons = await Promise.all(
    data.map(async (item) => {
      try {
        return item?.common?.directParent?.commonId
          ? await CommonService.getCachedCommonById(
              item.common?.directParent?.commonId,
            )
          : null;
      } catch (error) {
        return null;
      }
    }),
  );
  const finalData = batch.map<ItemBatch<FeedItemFollowWithMetadata> | null>(
    (batchItem) => {
      const foundItem = data.find(
        (item) => item?.feedItem?.id === batchItem.item.feedItemId,
      );

      if (!foundItem || !foundItem.common || !foundItem.feedItem) {
        return null;
      }

      const foundParentCommon = foundItem.common.directParent?.commonId
        ? parentCommons.find(
            (parentCommon) =>
              parentCommon?.id === foundItem.common?.directParent?.commonId,
          )
        : null;

      return {
        ...batchItem,
        item: {
          ...batchItem.item,
          commonName: foundItem.common.name,
          parentCommonName: foundParentCommon?.name,
          commonAvatar: foundItem.common.image,
          feedItem: foundItem.feedItem,
        },
      };
    },
  );

  return finalData
    .filter((item): item is ItemBatch<FeedItemFollowWithMetadata> =>
      Boolean(item),
    )
    .map<ItemBatch<FeedLayoutItemWithFollowData>>((item) => ({
      statuses: item.statuses,
      item: {
        type: InboxItemType.FeedItemFollow,
        itemId: item.item.feedItemId,
        feedItem: item.item.feedItem,
        feedItemFollowWithMetadata: item.item,
      },
    }));
};

const addMetadataToChatChannelsBatch = (
  batch: ItemBatch<ChatChannel>[],
): ItemBatch<ChatChannelLayoutItem>[] =>
  batch
    .filter(({ item: chatChannel }) => chatChannel.messageCount > 0)
    .map(({ item: chatChannel, statuses }) => ({
      item: {
        itemId: chatChannel.id,
        type: InboxItemType.ChatChannel,
        chatChannel: chatChannel,
      },
      statuses,
    }));

const addMetadataToItemsBatch = async (
  userId: string,
  batch: ItemsBatch,
  feedItemIdsForNotListening: string[] = [],
): Promise<ItemBatch<FeedLayoutItemWithFollowData>[]> => {
  const batchWithFeedItemFollowItems = (
    await Promise.all(
      batch.map(async (batchItem) => {
        const item =
          batchItem.item.type === InboxItemType.FeedItemFollow
            ? await FeedItemFollowsService.getFeedItemFollowDataById(
                userId,
                batchItem.item.itemId,
                FirestoreDataSource.Cache,
              )
            : null;

        return item ? { item, statuses: batchItem.statuses } : null;
      }, []),
    )
  ).filter((item): item is ItemBatch<FeedItemFollow> => Boolean(item));
  const batchWithChatChannelLayoutItems = (
    await Promise.all(
      batch.map(async (batchItem) => {
        if (batchItem.item.type !== InboxItemType.ChatChannel) {
          return null;
        }

        let item = await ChatService.getChatChannelById(
          batchItem.item.itemId,
          FirestoreDataSource.Cache,
        );

        if (item?.messageCount === 0) {
          item = await ChatService.getChatChannelById(
            batchItem.item.itemId,
            FirestoreDataSource.Server,
          );
        }

        return item ? { item, statuses: batchItem.statuses } : null;
      }, []),
    )
  ).filter((item): item is ItemBatch<ChatChannel> => Boolean(item));
  const batchWithFeedLayoutItemWithFollowItems =
    await addMetadataToFeedItemFollowItemsBatch(batchWithFeedItemFollowItems);

  return [
    ...batchWithFeedLayoutItemWithFollowItems,
    ...addMetadataToChatChannelsBatch(batchWithChatChannelLayoutItems),
  ].filter(({ item }) => !feedItemIdsForNotListening.includes(item.itemId));
};

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
