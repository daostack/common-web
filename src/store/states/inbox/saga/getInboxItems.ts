import { call, put, select } from "redux-saga/effects";
import { UserService } from "@/services";
import {
  ChatChannelToLayoutItemConverter,
  FeedItemFollowToLayoutItemWithFollowDataConverter,
} from "@/shared/converters";
import { Awaited, FeedLayoutItemWithFollowData } from "@/shared/interfaces";
import { isError } from "@/shared/utils";
import * as actions from "../actions";
import { selectInboxItems } from "../selectors";
import { InboxItems } from "../types";
import { getFeedLayoutItemDateForSorting } from "../utils";
import { searchFetchedInboxItems } from "./searchFetchedInboxItems";

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
      UserService.getInboxItemsWithMetadata,
      {
        startAfter: currentItems.lastDocTimestamp,
        limit,
        unread,
      },
    )) as Awaited<ReturnType<typeof UserService.getInboxItemsWithMetadata>>;
    const chatChannelItems = data.chatChannels
      .map((item) => ChatChannelToLayoutItemConverter.toTargetEntity(item))
      .filter((item) => item.chatChannel.messageCount > 0);
    const feedItemFollowItems = data.feedItemFollows.map((item) =>
      FeedItemFollowToLayoutItemWithFollowDataConverter.toTargetEntity(item),
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

    if (!isFirstRequest) {
      yield searchFetchedInboxItems(convertedData);
    }
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getInboxItems.failure(error));
    }
  }
}
