import { call, cancelled, delay, put } from "redux-saga/effects";
import {
  FeedItemFollowsService,
  Logger,
  getCancelTokenSource,
} from "@/services";
import { isError } from "@/shared/utils";
import * as actions from "../actions";

export function* followFeedItem(
  action: ReturnType<typeof actions.followFeedItem.request>,
) {
  const { payload } = action;
  const cancelToken = getCancelTokenSource();
  try {
    yield delay(2000);
    yield call(FeedItemFollowsService.followFeedItem, payload, {
      cancelToken: cancelToken.token,
    });
    yield put(actions.followFeedItem.success(payload));
  } catch (error) {
    if (isError(error)) {
      Logger.error(error);
      yield put(actions.followFeedItem.failure({ ...payload, error }));
    }
  } finally {
    if (yield cancelled()) {
      cancelToken.cancel();
      yield put(actions.followFeedItem.cancel(payload));
    }
  }
}
