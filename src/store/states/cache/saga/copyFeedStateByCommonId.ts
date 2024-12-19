import { put, select } from "redux-saga/effects";
import { getFeedLayoutItemDateForSorting } from "@/store/states/inbox/utils";
import { selectCommonState, CommonState } from "../../common";
import * as actions from "../actions";

export function* copyFeedStateByCommonId({
  payload: commonId,
}: ReturnType<typeof actions.copyFeedStateByCommonId>) {
  const commonState = (yield select(selectCommonState)) as CommonState;
  const specificCommonFeedItems = commonState.feedItems[commonId];
  const data =
    specificCommonFeedItems?.data && specificCommonFeedItems.data.slice(0, 30);
  const feedItems = {
    ...specificCommonFeedItems,
    data,
    loading: false,
    hasMore: true,
    firstDocTimestamp: data?.[0]
      ? getFeedLayoutItemDateForSorting(data[0])
      : null,
    lastDocTimestamp: data?.[data.length - 1]
      ? getFeedLayoutItemDateForSorting(data[data.length - 1])
      : null,
  };

  yield put(
    actions.updateFeedStateByCommonId({
      commonId,
      state: {
        feedItems,
        pinnedFeedItems: commonState.pinnedFeedItems[commonId],
        sharedFeedItem: commonState.sharedFeedItem[commonId],
      },
    }),
  );
}
