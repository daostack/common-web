import { takeLeadingByIdentifier } from "@/shared/utils/saga";
import * as actions from "../actions";
import { getDiscussionStateById } from "./getDiscussionStateById";
import { getUserStateById } from "./getUserStateById";

export function* mainSaga() {
  yield takeLeadingByIdentifier(
    actions.getUserStateById.request,
    (action) => action.payload.payload.userId,
    getUserStateById,
  );
  yield takeLeadingByIdentifier(
    actions.getDiscussionStateById.request,
    (action) => action.payload.payload.discussionId,
    getDiscussionStateById,
  );
}
