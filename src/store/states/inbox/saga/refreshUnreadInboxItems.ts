import { call, put, select } from "redux-saga/effects";
import { Logger, UserService } from "@/services";
import {
  ChatChannelToLayoutItemConverter,
  FeedItemFollowToLayoutItemWithFollowDataConverter,
} from "@/shared/converters";
import { Awaited, FeedLayoutItemWithFollowData } from "@/shared/interfaces";
import { Timestamp } from "@/shared/models";
import * as actions from "../actions";
import { selectInboxItems } from "../selectors";
import { InboxItems } from "../types";

const checkCanKeepFetchingByDate = (
  firstDocTimestamp: Timestamp | null,
  lastDocTimestamp: Timestamp | null,
): boolean => {
  if (!firstDocTimestamp) {
    return true;
  }
  if (!lastDocTimestamp) {
    return false;
  }

  return lastDocTimestamp.seconds >= firstDocTimestamp.seconds;
};

export function* refreshUnreadInboxItems() {
  try {
    const currentItems = (yield select(selectInboxItems)) as InboxItems;
    const { firstDocTimestamp } = currentItems;
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
        .map((item) => ChatChannelToLayoutItemConverter.toTargetEntity(item));
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
        hasMore &&
        checkCanKeepFetchingByDate(firstDocTimestamp, lastDocTimestamp);
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
