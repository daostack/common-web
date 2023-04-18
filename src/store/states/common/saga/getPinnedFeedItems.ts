import { call, put } from "redux-saga/effects";
import { FeedLayoutItem } from "@/pages/commonFeed";
import { CommonFeedService } from "@/services";
import { isError } from "@/shared/utils";
import * as actions from "../actions";

export function* getPinnedFeedItems(
  action: ReturnType<typeof actions.getPinnedFeedItems.request>,
) {
  const {
    payload: { commonId },
  } = action;

  try {
    const { data } = (yield call(
      CommonFeedService.getCommonPinnedFeedItems,
      commonId,
    )) as Awaited<
      ReturnType<typeof CommonFeedService.getCommonPinnedFeedItems>
    >;

    const convertedData: FeedLayoutItem[] = data.map((item) => ({
      feedItem: item,
    }));

    yield put(
      actions.getPinnedFeedItems.success({
        data: convertedData,
      }),
    );
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getPinnedFeedItems.failure(error));
    }
  }
}
