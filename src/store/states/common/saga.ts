import { call, put, select, takeLatest } from "redux-saga/effects";
import { CommonFeedService } from "@/services";
import { Awaited } from "@/shared/interfaces";
import { isError } from "@/shared/utils";
import * as actions from "./actions";
import { selectFeedItems } from "./selectors";
import { FeedItems } from "./types";

function* getFeedItems(
  action: ReturnType<typeof actions.getFeedItems.request>,
) {
  const {
    payload: { commonId, limit },
  } = action;

  try {
    const currentFeedItems = (yield select(selectFeedItems)) as FeedItems;
    const { data, lastDocSnapshot, hasMore } = (yield call(
      CommonFeedService.getCommonFeedItems,
      commonId,
      {
        startAfter: currentFeedItems.lastDocSnapshot,
        limit,
      },
    )) as Awaited<ReturnType<typeof CommonFeedService.getCommonFeedItems>>;

    yield put(
      actions.getFeedItems.success({
        data,
        lastDocSnapshot,
        hasMore,
      }),
    );
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getFeedItems.failure(error));
    }
  }
}

export function* mainSaga() {
  yield takeLatest(actions.getFeedItems.request, getFeedItems);
}
