import { takeLatest } from "redux-saga/effects";
import { takeLatestWithCancel } from "@/shared/utils/saga";
import * as actions from "../actions";
import { getInboxItems } from "./getInboxItems";
import { searchInboxItems } from "./searchInboxItems";

export function* mainSaga() {
  yield takeLatestWithCancel(
    actions.getInboxItems.request,
    actions.getInboxItems.cancel,
    getInboxItems,
  );
  yield takeLatest(actions.searchInboxItems, searchInboxItems);
}
