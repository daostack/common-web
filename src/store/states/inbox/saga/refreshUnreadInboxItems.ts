import { call, put, select } from "redux-saga/effects";
import { Logger, UserService } from "@/services";
import { InboxItemType } from "@/shared/constants";
import { FeedItemFollowToLayoutItemWithFollowDataConverter } from "@/shared/converters";
import {
  Awaited,
  ChatChannelLayoutItem,
  FeedLayoutItemWithFollowData,
} from "@/shared/interfaces";
import { Timestamp } from "@/shared/models";
import * as actions from "../actions";
import { selectInboxItems } from "../selectors";
import { InboxItems } from "../types";

export function* refreshUnreadInboxItems(
  action: ReturnType<typeof actions.refreshUnreadInboxItems.request>,
) {
  const {
    payload: { newItemsAmount },
  } = action;

  try {
    const currentItems = (yield select(selectInboxItems)) as InboxItems;
    const newItemsAmountToFetch =
      newItemsAmount - (currentItems.data?.length || 0);

    if (newItemsAmountToFetch <= 0) {
      return;
    }

    const newInboxItems: FeedLayoutItemWithFollowData[] = [];
    let startAfter: Timestamp | null = null;
    let keepItemsFetching = true;

    while (keepItemsFetching) {
      const { data, lastDocTimestamp, hasMore } = (yield call(
        UserService.getInboxItems,
        {
          startAfter,
          limit: 5,
          unread: true,
        },
      )) as Awaited<ReturnType<typeof UserService.getInboxItems>>;
      const chatChannelItems = data.chatChannels
        .filter(
          (chatChannel) =>
            chatChannel.messageCount > 0 &&
            (!currentItems.data ||
              currentItems.data.every(
                (item) => item.itemId !== chatChannel.id,
              )),
        )
        .map<ChatChannelLayoutItem>((chatChannel) => ({
          type: InboxItemType.ChatChannel,
          itemId: chatChannel.id,
          chatChannel,
        }));
      const feedItemFollowItems = data.feedItemFollows
        .filter(
          (feedItemFollow) =>
            !currentItems.data ||
            currentItems.data.every(
              (item) => item.itemId !== feedItemFollow.id,
            ),
        )
        .map((item) =>
          FeedItemFollowToLayoutItemWithFollowDataConverter.toTargetEntity(
            item,
          ),
        );
      newInboxItems.push(...chatChannelItems, ...feedItemFollowItems);
      keepItemsFetching =
        newInboxItems.length < newItemsAmountToFetch && hasMore;
      startAfter = lastDocTimestamp;
    }

    if (newInboxItems.length > 0) {
      yield put(
        actions.addNewInboxItems(
          newInboxItems.map((item) => ({
            item,
            statuses: {
              isAdded: false,
              isRemoved: false,
            },
          })),
        ),
      );
    }
  } catch (err) {
    Logger.error(err);
  }
}
