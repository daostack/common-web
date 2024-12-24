import { uniqBy } from "lodash";
import { call, put, select } from "redux-saga/effects";
import { selectUser } from "@/pages/Auth/store/selectors";
import { CommonFeedService } from "@/services";
import { InboxItemType } from "@/shared/constants";
import { Awaited, FeedItemFollowLayoutItem } from "@/shared/interfaces";
import { User } from "@/shared/models";
import { isError } from "@/shared/utils";
import { selectFeedStateByCommonId } from "@/store/states";
import * as actions from "../actions";
import { selectFeedItems } from "../selectors";
import { FeedItems } from "../types";
import { searchFetchedFeedItems } from "./searchFetchedFeedItems";

const FEED_ITEM_PATH_FOR_FILTERING = "feedItem.id";

export function* getFeedItems(
  action: ReturnType<typeof actions.getFeedItems.request>,
) {
  const {
    payload: { commonId, sharedFeedItemId, feedItemId, limit },
  } = action;

  try {
    const currentFeedItems = (yield select(
      selectFeedItems(commonId),
    )) as FeedItems;
    const cachedFeedState = yield select(selectFeedStateByCommonId(commonId));
    const user = (yield select(selectUser())) as User | null;
    const userId = user?.uid;

    console.log('---cachedFeedState.feedItems',cachedFeedState.feedItems);
    if (!currentFeedItems.data && !feedItemId && cachedFeedState) {
      yield put(
        actions.setFeedState({
          data: {
            ...cachedFeedState,
            feedItems: {
              ...cachedFeedState.feedItems,
              data: uniqBy(
                cachedFeedState.feedItems.data,
                FEED_ITEM_PATH_FOR_FILTERING,
              ),
            },
            pinnedFeedItems: {
              ...cachedFeedState.pinnedFeedItems,
              data: uniqBy(
                cachedFeedState.pinnedFeedItems.data,
                FEED_ITEM_PATH_FOR_FILTERING,
              ),
            },
          },
          sharedFeedItemId,
          commonId,
        }),
      );
      return;
    }

    const isFirstRequest = !currentFeedItems.lastDocTimestamp;
    const { data, firstDocTimestamp, lastDocTimestamp, hasMore } = (yield call(
      CommonFeedService.getCommonFeedItemsByUpdatedAt,
      commonId,
      userId,
      {
        startAfter: currentFeedItems.lastDocTimestamp,
        feedItemId,
        limit,
      },
    )) as Awaited<
      ReturnType<typeof CommonFeedService.getCommonFeedItemsByUpdatedAt>
    >;
    const convertedData: FeedItemFollowLayoutItem[] = data.map((item) => ({
      type: InboxItemType.FeedItemFollow,
      itemId: item.id,
      feedItem: item,
    }));

    yield put(
      actions.getFeedItems.success({
        data: convertedData,
        lastDocTimestamp,
        hasMore,
        firstDocTimestamp: isFirstRequest
          ? firstDocTimestamp
          : currentFeedItems.firstDocTimestamp,
        commonId,
      }),
    );

    if (!isFirstRequest) {
      yield searchFetchedFeedItems({ data: convertedData, commonId });
    }
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getFeedItems.failure({ error, commonId }));
    }
  }
}
