import { call, put, takeLatest } from "redux-saga/effects";
import { isError } from "@/shared/utils";
import { actions } from ".";
import { buildShareLink as buildShareLinkApi } from "./api";

export function* buildShareLink({
  payload,
}: ReturnType<typeof actions.buildShareLink.request>): Generator {
  try {
    const url = (yield call(
      buildShareLinkApi,
      payload.payload.linkInfo,
    )) as string;

    yield put(
      actions.buildShareLink.success({
        key: payload.payload.key,
        link: url,
      }),
    );

    if (payload.callback) {
      payload.callback(null, url);
    }
  } catch (error) {
    console.log("Building of share links work only in production and staging");

    if (isError(error)) {
      yield put(
        actions.buildShareLink.failure({
          key: payload.payload.key,
          error,
        }),
      );

      if (payload.callback) {
        payload.callback(error);
      }
    }
  }
}

export function* saga() {
  yield takeLatest(actions.buildShareLink.request, buildShareLink);
}

export default saga;
