import { takeLatestWithCancel } from "@/shared/utils/saga";
import * as actions from "../actions";
import { getInboxItems } from "./getInboxItems";

export function* mainSaga() {
  yield takeLatestWithCancel(
    actions.getInboxItems.request,
    actions.getInboxItems.cancel,
    getInboxItems,
  );
}
