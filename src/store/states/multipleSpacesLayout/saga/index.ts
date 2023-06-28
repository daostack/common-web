import { takeLatestWithCancel } from "@/shared/utils/saga";
import * as actions from "../actions";
import { fetchBreadcrumbsData } from "./fetchBreadcrumbsData";

export function* mainSaga() {
  yield takeLatestWithCancel(
    actions.fetchBreadcrumbsData.request,
    actions.fetchBreadcrumbsData.cancel,
    fetchBreadcrumbsData,
  );
}
