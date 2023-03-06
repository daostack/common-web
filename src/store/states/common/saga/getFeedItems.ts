import { call, put, select } from "redux-saga/effects";
import { CommonFeedService } from "@/services";
import { Awaited } from "@/shared/interfaces";
import { isError } from "@/shared/utils";
import * as actions from "../actions";
import { selectFeedItems } from "../selectors";
import { FeedItems } from "../types";

export function* getFeedItems(
  action: ReturnType<typeof actions.getFeedItems.request>,
) {
  const {
    payload: { commonId, limit },
  } = action;

  try {
    const currentFeedItems = (yield select(selectFeedItems)) as FeedItems;
    const isFirstRequest = !currentFeedItems.lastDocTimestamp;
    const { data, firstDocTimestamp, lastDocTimestamp, hasMore } = (yield call(
      CommonFeedService.getCommonFeedItemsByUpdatedAt,
      commonId,
      {
        startAfter: currentFeedItems.lastDocTimestamp,
        limit,
      },
    )) as Awaited<
      ReturnType<typeof CommonFeedService.getCommonFeedItemsByUpdatedAt>
    >;

    yield put(
      actions.getFeedItems.success({
        data,
        lastDocTimestamp,
        hasMore,
        firstDocTimestamp: isFirstRequest
          ? firstDocTimestamp
          : currentFeedItems.firstDocTimestamp,
      }),
    );
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getFeedItems.failure(error));
    }
  }
}
