import { call, put, select } from "redux-saga/effects";
import { selectUser } from "@/pages/Auth/store/selectors";
import { UserService } from "@/services";
import { Awaited } from "@/shared/interfaces";
import { User } from "@/shared/models";
import { isError } from "@/shared/utils";
import * as actions from "../actions";
import { selectMultipleSpacesLayoutBreadcrumbs } from "../selectors";
import { MultipleSpacesLayoutState } from "../types";

// fetchBreadcrumbsDataByCommonId
// fetchFeedItemBreadcrumbsData

export function* fetchBreadcrumbsData(
  action: ReturnType<typeof actions.fetchBreadcrumbsData.request>,
) {
  const {
    payload: { item, commonId },
  } = action;

  try {
    const user = (yield select(selectUser())) as User | null;
    const currentItems = (yield select(
      selectMultipleSpacesLayoutBreadcrumbs,
    )) as MultipleSpacesLayoutState["breadcrumbs"];
    const { data, firstDocTimestamp, lastDocTimestamp, hasMore } = (yield call(
      UserService.getInboxItems,
      {
        startAfter: currentItems.lastDocTimestamp,
        limit,
      },
    )) as Awaited<ReturnType<typeof UserService.getInboxItems>>;

    yield put(actions.getInboxItems.success());
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getInboxItems.failure(error));
    }
  }
}
