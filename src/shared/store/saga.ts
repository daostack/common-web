import { call, put, takeLatest } from "redux-saga/effects";
import { buildShareLink as buildShareLinkApi } from "./api";
import { actions } from ".";

export function* buildShareLink({
  payload,
}: ReturnType<typeof actions.buildShareLink.request>): Generator {
  try {
    const url = (yield call(
      buildShareLinkApi,
      payload.payload.linkInfo
    )) as string;

    yield put(
      actions.buildShareLink.success({
        key: payload.payload.key,
        link: url,
      })
    );
    payload.callback(null, url);
  } catch (error) {
    console.log("Building of share links work only in production");
    yield put(actions.buildShareLink.failure(error));
    payload.callback(error);
  }
}

export function* saga() {
  yield takeLatest(actions.buildShareLink.request, buildShareLink);
}

export default saga;
