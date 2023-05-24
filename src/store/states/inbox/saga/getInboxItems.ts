import { call, put, select } from "redux-saga/effects";
import {
  ChatChannelLayoutItem,
  checkIsFeedItemFollowLayoutItem,
  FeedItemFollowLayoutItemWithFollowData,
  FeedLayoutItemWithFollowData,
} from "@/pages/commonFeed/components";
import { UserService } from "@/services";
import { InboxItemType } from "@/shared/constants";
import { Awaited } from "@/shared/interfaces";
import { isError } from "@/shared/utils";
import * as actions from "../actions";
import { selectInboxItems } from "../selectors";
import { InboxItems } from "../types";

const getItemDateForSorting = (item: FeedLayoutItemWithFollowData): number =>
  checkIsFeedItemFollowLayoutItem(item)
    ? item.feedItem.updatedAt.seconds * 1000
    : item.chatChannel.updatedAt.seconds * 1000;

const sortItems = (
  data: FeedLayoutItemWithFollowData[],
): FeedLayoutItemWithFollowData[] =>
  [...data].sort((prevItem, nextItem) => {
    const prevItemDate = getItemDateForSorting(prevItem);
    const nextItemDate = getItemDateForSorting(nextItem);

    return nextItemDate - prevItemDate;
  });

export function* getInboxItems(
  action: ReturnType<typeof actions.getInboxItems.request>,
) {
  const {
    payload: { limit },
  } = action;

  try {
    const currentItems = (yield select(selectInboxItems)) as InboxItems;
    const isFirstRequest = !currentItems.lastDocTimestamp;
    const { data, firstDocTimestamp, lastDocTimestamp, hasMore } = (yield call(
      UserService.getInboxItems,
      {
        startAfter: currentItems.lastDocTimestamp,
        limit,
      },
    )) as Awaited<ReturnType<typeof UserService.getInboxItems>>;
    const chatChannelItems = data.chatChannels.map<ChatChannelLayoutItem>(
      (chatChannel) => ({
        type: InboxItemType.ChatChannel,
        itemId: chatChannel.id,
        chatChannel,
      }),
    );
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
      }),
    );
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getInboxItems.failure(error));
    }
  }
}
