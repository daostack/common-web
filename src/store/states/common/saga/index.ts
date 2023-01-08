import { takeLatest } from "redux-saga/effects";
import * as actions from "../actions";
import { getFeedItems } from "./getFeedItems";

export function* mainSaga() {
  yield takeLatest(actions.getFeedItems.request, getFeedItems);
}
