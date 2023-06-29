import { takeLatest } from "redux-saga/effects";
import { takeLatestWithCancel } from "@/shared/utils/saga";
import * as actions from "../actions";
import { configureBreadcrumbsData } from "./configureBreadcrumbsData";
import { fetchBreadcrumbsItemsByCommonId } from "./fetchBreadcrumbsItemsByCommonId";

export function* mainSaga() {
  yield takeLatest(actions.configureBreadcrumbsData, configureBreadcrumbsData);
  yield takeLatestWithCancel(
    actions.fetchBreadcrumbsItemsByCommonId.request,
    actions.fetchBreadcrumbsItemsByCommonId.cancel,
    fetchBreadcrumbsItemsByCommonId,
  );
}
