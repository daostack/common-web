import { call, put, select } from "redux-saga/effects";
import { UserService } from "@/services";
import { Awaited } from "@/shared/interfaces";
import { isError } from "@/shared/utils";
import * as actions from "../actions";
import { selectInboxItems } from "../selectors";
import { InboxItems } from "../types";

export function* getInboxItems(
  action: ReturnType<typeof actions.getInboxItems.request>,
) {
  const {
    payload: { limit },
  } = action;

  try {
    const currentItems = (yield select(selectInboxItems)) as InboxItems;
    const isFirstRequest = !currentItems.lastDocTimestamp;
    const { data, firstDocTimestamp, lastDocTimestamp, hasMore } = (yield call(
      UserService.getInboxItems,
      {
        startAfter: currentItems.lastDocTimestamp,
        limit,
      },
    )) as Awaited<ReturnType<typeof UserService.getInboxItems>>;

    yield put(
      actions.getInboxItems.success({
        data,
        lastDocTimestamp,
        hasMore,
        firstDocTimestamp: isFirstRequest
          ? firstDocTimestamp
          : currentItems.firstDocTimestamp,
      }),
    );
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getInboxItems.failure(error));
    }
  }
}
