import { takeLeadingByIdentifier } from "@/shared/utils/saga";
import * as actions from "../actions";
import { getDiscussionStateById } from "./getDiscussionStateById";
import { getProposalStateById } from "./getProposalStateById";
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
  yield takeLeadingByIdentifier(
    actions.getProposalStateById.request,
    (action) => action.payload.payload.proposalId,
    getProposalStateById,
  );
}
