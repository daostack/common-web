import { takeLatestWithCancel } from "@/shared/utils/saga";
import * as actions from "../actions";
import { getInboxItems } from "./getInboxItems";
import { refreshUnreadInboxItems } from "./refreshUnreadInboxItems";

export function* mainSaga() {
  yield takeLatestWithCancel(
    actions.getInboxItems.request,
    actions.getInboxItems.cancel,
    getInboxItems,
  );
  yield takeLatestWithCancel(
    actions.refreshUnreadInboxItems.request,
    actions.refreshUnreadInboxItems.cancel,
    refreshUnreadInboxItems,
  );
}
