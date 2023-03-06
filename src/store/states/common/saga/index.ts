import { takeLatest } from "redux-saga/effects";
import * as actions from "../actions";
import { createDiscussion } from "./createDiscussion";
import { createSurveyProposal, createFundingProposal } from "./createProposal";
import { getFeedItems } from "./getFeedItems";

export function* mainSaga() {
  yield takeLatest(actions.createSurveyProposal.request, createSurveyProposal);
  yield takeLatest(actions.createFundingProposal.request, createFundingProposal);
  yield takeLatest(actions.createDiscussion.request, createDiscussion);
  yield takeLatest(actions.getFeedItems.request, getFeedItems);
}
