import { call, put, select } from "redux-saga/effects";
import { UserService } from "@/services";
import { InboxItemType } from "@/shared/constants";
import {
  Awaited,
  ChatChannelLayoutItem,
  FeedItemFollowLayoutItemWithFollowData,
  FeedLayoutItemWithFollowData,
} from "@/shared/interfaces";
import { isError } from "@/shared/utils";
import * as actions from "../actions";
import { selectInboxItems } from "../selectors";
import { InboxItems } from "../types";
import { getFeedLayoutItemDateForSorting } from "../utils";

const sortItems = (
  data: FeedLayoutItemWithFollowData[],
): FeedLayoutItemWithFollowData[] =>
  [...data].sort((prevItem, nextItem) => {
    const prevItemDate =
      getFeedLayoutItemDateForSorting(prevItem).seconds * 1000;
    const nextItemDate =
      getFeedLayoutItemDateForSorting(nextItem).seconds * 1000;

    return nextItemDate - prevItemDate;
  });

export function* getInboxItems(
  action: ReturnType<typeof actions.getInboxItems.request>,
) {
  const {
    payload: { limit, unread = false },
  } = action;

  try {
    const currentItems = (yield select(selectInboxItems)) as InboxItems;
    const isFirstRequest = !currentItems.lastDocTimestamp;
    const { data, firstDocTimestamp, lastDocTimestamp, hasMore } = (yield call(
      UserService.getInboxItems,
      {
        startAfter: currentItems.lastDocTimestamp,
        limit,
        unread,
      },
    )) as Awaited<ReturnType<typeof UserService.getInboxItems>>;
    const chatChannelItems = data.chatChannels
      .map<ChatChannelLayoutItem>((chatChannel) => ({
        type: InboxItemType.ChatChannel,
        itemId: chatChannel.id,
        chatChannel,
      }))
      .filter((item) => item.chatChannel.messageCount > 0);
    const feedItemFollowItems =
      data.feedItemFollows.map<FeedItemFollowLayoutItemWithFollowData>(
        (feedItemFollowWithMetadata) => ({
          type: InboxItemType.FeedItemFollow,
          itemId: feedItemFollowWithMetadata.feedItemId,
          feedItem: feedItemFollowWithMetadata.feedItem,
          feedItemFollowWithMetadata: feedItemFollowWithMetadata,
        }),
      );
    const convertedData = sortItems([
      ...chatChannelItems,
      ...feedItemFollowItems,
    ]);

    yield put(
      actions.getInboxItems.success({
        data: convertedData,
        lastDocTimestamp,
        hasMore,
        firstDocTimestamp: isFirstRequest
          ? firstDocTimestamp
          : currentItems.firstDocTimestamp,
        unread,
      }),
    );
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getInboxItems.failure(error));
    }
  }
}
