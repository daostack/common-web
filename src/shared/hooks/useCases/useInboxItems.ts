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
import { useIsMounted } from "@/shared/hooks";
import {
  ChatChannelLayoutItem,
  FeedLayoutItemWithFollowData,
} from "@/shared/interfaces";
import {
  ChatChannel,
  FeedItemFollow,
  FeedItemFollowWithMetadata,
  InboxItem,
  Timestamp,
} from "@/shared/models";
import { inboxActions, InboxItems, selectInboxItems } from "@/store/states";

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
        const item =
          batchItem.item.type === InboxItemType.ChatChannel
            ? await ChatService.getChatChannelById(
                batchItem.item.itemId,
                FirestoreDataSource.Cache,
              )
            : null;

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

export const useInboxItems = (
  feedItemIdsForNotListening?: string[],
  options?: { unread?: boolean },
): Return => {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const [newItemsBatches, setNewItemsBatches] = useState<ItemsBatch[]>([]);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Timestamp | null>(null);
  const inboxItems = useSelector(selectInboxItems);
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
    dispatch(inboxActions.resetInboxItems());
    fetch();
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

        if (!isMounted()) {
          return;
        }

        const filteredInboxItems = data
          ? fetchedInboxItems.filter((fetchedItem) =>
              data.every((item) => item.itemId !== fetchedItem.itemId),
            )
          : fetchedInboxItems;

        addNewInboxItems(
          filteredInboxItems.map((item) => ({
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

    (async () => {
      try {
        const finalData = await addMetadataToItemsBatch(
          userId,
          lastBatch,
          feedItemIdsForNotListening,
        );

        if (finalData.length > 0) {
          dispatch(inboxActions.addNewInboxItems(finalData));
        }
      } catch (error) {
        Logger.error(error);
      } finally {
        setNewItemsBatches((currentItems) => currentItems.slice(1));
      }
    })();
  }, [lastBatch]);

  return {
    ...inboxItems,
    fetch,
    refetch,
  };
};
