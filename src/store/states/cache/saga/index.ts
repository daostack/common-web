import { takeLeadingByIdentifier } from "@/shared/utils/saga";
import * as actions from "../actions";
import { getUserStateById } from "./getUserStateById";

export function* mainSaga() {
  yield takeLeadingByIdentifier(
    actions.getUserStateById.request,
    (action) => action.payload.payload.userId,
    getUserStateById,
  );
}
