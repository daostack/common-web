import { call, put } from "redux-saga/effects";
import { CommonFeedService } from "@/services";
import { InboxItemType } from "@/shared/constants";
import { FeedItemFollowLayoutItem } from "@/shared/interfaces";
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

    const convertedData: FeedItemFollowLayoutItem[] = data.map((item) => ({
      type: InboxItemType.FeedItemFollow,
      itemId: item.id,
      feedItem: item,
    }));

    yield put(
      actions.getPinnedFeedItems.success({
        data: convertedData,
        commonId,
      }),
    );
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getPinnedFeedItems.failure({ error, commonId }));
    }
  }
}
