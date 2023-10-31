import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  ChatService,
  CommonFeedService,
  CommonService,
  FeedItemFollowsService,
  Logger,
} from "@/services";
import { InboxItemType } from "@/shared/constants";
import { FeedLayoutItemWithFollowData } from "@/shared/interfaces";
import { FeedItemFollow, FeedItemFollowWithMetadata } from "@/shared/models";
import { inboxActions, InboxItems, selectInboxItems } from "@/store/states";

interface Return extends Pick<InboxItems, "data" | "loading" | "hasMore"> {
  fetch: () => void;
  refetch: () => void;
}

interface ItemBatch<T = FeedItemFollow> {
  item: T;
  statuses: {
    isAdded: boolean;
    isRemoved: boolean;
  };
}

type ItemsBatch = ItemBatch[];

const addMetadataToItemsBatch = async (
  batch: ItemsBatch,
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

export const useInboxItems = (
  feedItemIdsForNotListening?: string[],
  options?: { unread?: boolean },
): Return => {
  const dispatch = useDispatch();
  const [newItemsBatches, setNewItemsBatches] = useState<ItemsBatch[]>([]);
  const inboxItems = useSelector(selectInboxItems);
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const lastBatch = newItemsBatches[0];

  const fetch = () => {
    dispatch(
      inboxActions.getInboxItems.request({
        limit: 15,
        unread: options?.unread,
      }),
    );
  };

  const refetch = () => {
    dispatch(inboxActions.resetInboxItems());
    fetch();
  }

  useEffect(() => {
    if (!inboxItems.firstDocTimestamp || !userId) {
      return;
    }

    const unsubscribe = ChatService.subscribeToNewUpdatedChatChannels(
      userId,
      inboxItems.firstDocTimestamp,
      (data) => {
        const finalData =
          feedItemIdsForNotListening && feedItemIdsForNotListening.length > 0
            ? data.filter(
                (item) =>
                  !feedItemIdsForNotListening.includes(item.chatChannel.id),
              )
            : data;

        if (finalData.length === 0) {
          return;
        }

        dispatch(
          inboxActions.addNewInboxItems(
            finalData.map((item) => ({
              item: {
                itemId: item.chatChannel.id,
                type: InboxItemType.ChatChannel,
                chatChannel: item.chatChannel,
              },
              statuses: item.statuses,
            })),
          ),
        );
      },
    );

    return unsubscribe;
  }, [inboxItems.firstDocTimestamp, userId, feedItemIdsForNotListening]);

  useEffect(() => {
    if (!inboxItems.firstDocTimestamp || !userId) {
      return;
    }

    const unsubscribe =
      FeedItemFollowsService.subscribeToNewUpdatedFollowFeedItem(
        userId,
        inboxItems.firstDocTimestamp,
        (data) => {
          if (data.length === 0) {
            return;
          }

          const finalData =
            feedItemIdsForNotListening && feedItemIdsForNotListening.length > 0
              ? data.filter(
                  (item) =>
                    !feedItemIdsForNotListening.includes(item.item.feedItemId),
                )
              : data;
          setNewItemsBatches((currentItems) => [...currentItems, finalData]);
        },
      );

    return unsubscribe;
  }, [inboxItems.firstDocTimestamp, userId, feedItemIdsForNotListening]);

  useEffect(() => {
    if (!lastBatch) {
      return;
    }
    if (lastBatch.length === 0) {
      setNewItemsBatches((currentItems) => currentItems.slice(1));
      return;
    }

    (async () => {
      try {
        const finalData = await addMetadataToItemsBatch(lastBatch);
        dispatch(inboxActions.addNewInboxItems(finalData));
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
