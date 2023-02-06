import { call, put, select } from "redux-saga/effects";
import { CommonFeedObjectUserUniqueService } from "@/services";
import { Awaited, LoadingState } from "@/shared/interfaces";
import { CommonFeedObjectUserUnique } from "@/shared/models";
import { isError } from "@/shared/utils";
import * as actions from "../actions";
import { selectFeedItemUserMetadata } from "../selectors";

const getStateAction = actions.getFeedItemUserMetadata;
const updateStateAction = actions.updateFeedItemUserMetadata;
const requestFunction =
  CommonFeedObjectUserUniqueService.getFeedItemUserMetadata;

type State = LoadingState<CommonFeedObjectUserUnique | null>;

export function* getFeedItemUserMetadataState({
  payload,
}: ReturnType<typeof getStateAction.request>) {
  const { commonId, userId, feedObjectId } = payload.payload;

  if (!commonId || !userId || !feedObjectId) {
    return;
  }

  try {
    const state =
      ((yield select(
        selectFeedItemUserMetadata({ commonId, userId, feedObjectId }),
      )) as State) || null;

    if (state?.fetched || state?.loading) {
      return;
    }

    yield put(
      updateStateAction({
        commonId,
        userId,
        feedObjectId,
        state: {
          loading: true,
          fetched: false,
          data: null,
        },
      }),
    );
    const data = (yield call(
      requestFunction,
      commonId,
      userId,
      feedObjectId,
    )) as Awaited<ReturnType<typeof requestFunction>>;

    yield put(
      updateStateAction({
        commonId,
        userId,
        feedObjectId,
        state: {
          loading: false,
          fetched: true,
          data,
        },
      }),
    );
    yield put(getStateAction.success(data));

    if (payload.callback) {
      payload.callback(null, data);
    }
  } catch (error) {
    yield put(
      updateStateAction({
        commonId,
        userId,
        feedObjectId,
        state: {
          loading: false,
          fetched: true,
          data: null,
        },
      }),
    );

    if (isError(error)) {
      yield put(getStateAction.failure(error));

      if (payload.callback) {
        payload.callback(error);
      }
    }
  }
}
