import { put, select } from "redux-saga/effects";
import { selectCommonState, CommonState } from "../../common";
import * as actions from "../actions";

export function* copyFeedStateByCommonId({
  payload: commonId,
}: ReturnType<typeof actions.copyFeedStateByCommonId>) {
  const commonState = (yield select(selectCommonState)) as CommonState;
  yield put(
    actions.updateFeedStateByCommonId({
      commonId,
      state: {
        feedItems: commonState.feedItems,
        pinnedFeedItems: commonState.pinnedFeedItems,
        sharedFeedItem: commonState.sharedFeedItem,
      },
    }),
  );
}
