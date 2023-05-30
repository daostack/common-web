import { takeLatest } from "redux-saga/effects";
import { takeLatestWithCancel } from "@/shared/utils/saga";
import * as actions from "../actions";
import { createDiscussion } from "./createDiscussion";
import { createSurveyProposal, createFundingProposal } from "./createProposal";
import { editDiscussion } from "./editDiscussion";
import { getFeedItems } from "./getFeedItems";
import { getPinnedFeedItems } from "./getPinnedFeedItems";

export function* mainSaga() {
  yield takeLatest(actions.createSurveyProposal.request, createSurveyProposal);
  yield takeLatest(
    actions.createFundingProposal.request,
    createFundingProposal,
  );
  yield takeLatest(actions.createDiscussion.request, createDiscussion);
  yield takeLatest(actions.editDiscussion.request, editDiscussion);
  yield takeLatestWithCancel(
    actions.getFeedItems.request,
    actions.getFeedItems.cancel,
    getFeedItems,
  );
  yield takeLatestWithCancel(
    actions.getPinnedFeedItems.request,
    actions.getPinnedFeedItems.cancel,
    getPinnedFeedItems,
  );
}
