import { getFeedItemUserMetadataKey } from "@/shared/constants/getFeedItemUserMetadataKey";
import { takeLeadingByIdentifier } from "@/shared/utils/saga";
import * as actions from "../actions";
import { getDiscussionStateById } from "./getDiscussionStateById";
import { getFeedItemUserMetadataState } from "./getFeedItemUserMetadataState";
import { getGovernanceStateByCommonId } from "./getGovernanceStateByCommonId";
import { getProposalStateById } from "./getProposalStateById";
import { getUserStateById } from "./getUserStateById";

export function* mainSaga() {
  yield takeLeadingByIdentifier(
    actions.getUserStateById.request,
    (action) => action.payload.payload.userId,
    getUserStateById,
  );
  yield takeLeadingByIdentifier(
    actions.getGovernanceStateByCommonId.request,
    (action) => action.payload.payload.commonId,
    getGovernanceStateByCommonId,
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
  yield takeLeadingByIdentifier(
    actions.getFeedItemUserMetadata.request,
    ({ payload: { payload } }) => getFeedItemUserMetadataKey(payload),
    getFeedItemUserMetadataState,
  );
}
