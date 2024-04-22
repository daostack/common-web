import { call, put, select } from "redux-saga/effects";
import { selectUser } from "@/pages/Auth/store/selectors";
import { UserService } from "@/services";
import {
  Awaited,
  checkIsChatChannelLayoutItem,
  FeedLayoutItemWithFollowData,
} from "@/shared/interfaces";
import { User } from "@/shared/models";
import { isError } from "@/shared/utils";
import * as actions from "../actions";
import { selectInboxItems, selectInboxSearchValue } from "../selectors";
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
    payload: { limit, unread = false, shouldUseLastStateIfExists = false },
  } = action;

  try {
    const user = (yield select(selectUser())) as User | null;

    if (!user) {
      throw new Error("There is no user for inbox items fetch");
    }

    const searchValue: string = yield select(selectInboxSearchValue);
    const currentItems = (yield select(selectInboxItems)) as InboxItems;
    const isFirstRequest = !currentItems.lastDocTimestamp;

    if (shouldUseLastStateIfExists && !isFirstRequest) {
      return;
    }

    const { data, firstDocTimestamp, lastDocTimestamp, hasMore } = (yield call(
      UserService.getInboxItemsWithMetadata,
      {
        userId: user.uid,
        startAfter: currentItems.lastDocTimestamp,
        limit: searchValue ? 500 : limit,
        unread,
      },
    )) as Awaited<ReturnType<typeof UserService.getInboxItemsWithMetadata>>;
    const filteredData = data.filter(
      (item) =>
        !checkIsChatChannelLayoutItem(item) ||
        item.chatChannel.messageCount > 0,
    );
    const sortedData = sortItems(filteredData);

    yield put(
      actions.getInboxItems.success({
        data: sortedData,
        lastDocTimestamp,
        hasMore,
        firstDocTimestamp: isFirstRequest
          ? firstDocTimestamp
          : currentItems.firstDocTimestamp,
        unread,
      }),
    );

    yield searchFetchedInboxItems(sortedData);
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getInboxItems.failure(error));
    }
  }
}
