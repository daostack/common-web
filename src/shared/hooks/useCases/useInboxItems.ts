import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { CommonService, FeedItemFollowsService, Logger } from "@/services";
import { FeedItemFollow, FeedItemFollowWithMetadata } from "@/shared/models";
import { inboxActions, InboxItems, selectInboxItems } from "@/store/states";

interface Return extends Pick<InboxItems, "data" | "loading" | "hasMore"> {
  fetch: () => void;
}

interface ItemBatch<T = FeedItemFollow> {
  item: T;
  statuses: {
    isAdded: boolean;
    isRemoved: boolean;
  };
}

type ItemsBatch = ItemBatch[];

export const useInboxItems = (
  feedItemIdsForNotListening?: string[],
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
      }),
    );
  };

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
          setNewItemsBatches((currentItems) => currentItems.concat(finalData));
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
        const commons = await Promise.all(
          lastBatch.map(async (item) => {
            try {
              return await CommonService.getCachedCommonById(
                item.item.commonId,
              );
            } catch (error) {
              return null;
            }
          }),
        );
        const parentCommons = await Promise.all(
          commons.map(async (common) => {
            try {
              return common?.directParent?.commonId
                ? await CommonService.getCachedCommonById(
                    common?.directParent?.commonId,
                  )
                : null;
            } catch (error) {
              return null;
            }
          }),
        );
        const finalData = lastBatch.map<ItemBatch<FeedItemFollowWithMetadata>>(
          (item) => {
            const foundCommon = commons.find(
              (common) => common?.id === item.item.commonId,
            );
            const foundParentCommon = foundCommon?.directParent?.commonId
              ? parentCommons.find(
                  (parentCommon) =>
                    parentCommon?.id === foundCommon?.directParent?.commonId,
                )
              : null;

            return {
              ...item,
              item: {
                ...item.item,
                commonName: foundCommon?.name || "Unknown",
                parentCommonName: foundParentCommon?.name,
                commonAvatar: foundCommon?.image || "",
              },
            };
          },
        );
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
  };
};
