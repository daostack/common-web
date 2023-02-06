import { takeLatest } from "redux-saga/effects";
import * as actions from "../actions";
import { createDiscussion } from "./createDiscussion";
import { getFeedItems } from "./getFeedItems";

export function* mainSaga() {
  yield takeLatest(actions.createDiscussion.request, createDiscussion);
  yield takeLatest(actions.getFeedItems.request, getFeedItems);
}
