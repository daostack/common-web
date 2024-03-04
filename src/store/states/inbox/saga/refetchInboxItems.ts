import { put, select } from "redux-saga/effects";
import * as actions from "../actions";
import { selectInboxSearchValue } from "../selectors";
import { searchUnreadInboxItems } from "./searchUnreadInboxItems";

export function* refetchInboxItems(
  action: ReturnType<typeof actions.refetchInboxItems>,
) {
  const unread = action.payload;
  const searchValue: string = yield select(selectInboxSearchValue);

  if (searchValue) {
    if (unread) {
      yield searchUnreadInboxItems(searchValue);
    }
  } else {
    yield put(actions.resetSearchInboxItems());
  }

  yield put(
    actions.saveLastState({
      shouldSaveAsReadState: unread,
    }),
  );
  yield put(actions.resetInboxItems());
  yield put(
    actions.getInboxItems.request({
      limit: 15,
      unread,
      shouldUseLastStateIfExists: true,
    }),
  );
}
