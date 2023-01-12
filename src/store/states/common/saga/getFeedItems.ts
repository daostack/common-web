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
    const isFirstRequest = !currentFeedItems.lastDocSnapshot;
    const { data, firstDocSnapshot, lastDocSnapshot, hasMore } = (yield call(
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
        firstDocSnapshot: isFirstRequest
          ? firstDocSnapshot
          : currentFeedItems.firstDocSnapshot,
      }),
    );
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getFeedItems.failure(error));
    }
  }
}
