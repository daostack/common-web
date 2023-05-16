import { takeLatestWithCancelByIdentifier } from "@/shared/utils/saga";
import * as actions from "../actions";
import { followFeedItem } from "./followFeedItem";

export function* mainSaga() {
  yield takeLatestWithCancelByIdentifier(
    actions.followFeedItem.request,
    (
      action:
        | ReturnType<typeof actions.followFeedItem.request>
        | ReturnType<typeof actions.followFeedItem.cancel>,
    ) => {
      return `${action.type}-${action.payload.commonId}-${action.payload.feedItemId}`;
    },
    actions.followFeedItem.cancel,
    followFeedItem,
  );
}
