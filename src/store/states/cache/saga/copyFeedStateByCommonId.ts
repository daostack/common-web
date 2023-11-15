import { put, select } from "redux-saga/effects";
import { getFeedLayoutItemDateForSorting } from "@/store/states/inbox/utils";
import { selectCommonState, CommonState } from "../../common";
import * as actions from "../actions";

export function* copyFeedStateByCommonId({
  payload: commonId,
}: ReturnType<typeof actions.copyFeedStateByCommonId>) {
  const commonState = (yield select(selectCommonState)) as CommonState;
  const data =
    commonState.feedItems.data && commonState.feedItems.data.slice(0, 30);
  const feedItems = {
    ...commonState.feedItems,
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
        pinnedFeedItems: commonState.pinnedFeedItems,
        sharedFeedItem: commonState.sharedFeedItem,
      },
    }),
  );
}
