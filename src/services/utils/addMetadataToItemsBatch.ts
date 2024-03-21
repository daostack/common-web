import { FirestoreDataSource, InboxItemType } from "@/shared/constants";
import {
  ChatChannelLayoutItem,
  FeedLayoutItemWithFollowData,
  InboxItemBatch as ItemBatch,
  InboxItemsBatch as ItemsBatch,
} from "@/shared/interfaces";
import {
  ChatChannel,
  FeedItemFollow,
  FeedItemFollowWithMetadata,
} from "@/shared/models";
import ChatService from "../Chat";
import CommonService from "../Common";
import CommonFeedService from "../CommonFeed";
import FeedItemFollowsService from "../FeedItemFollows";

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
          listVisibility: foundItem.common.listVisibility,
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

export const addMetadataToItemsBatch = async (
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
