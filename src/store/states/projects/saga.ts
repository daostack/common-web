import { call, put, takeLatest } from "redux-saga/effects";
import { CommonService } from "@/services";
import { isError } from "@/shared/utils";
import * as actions from "./actions";

function* getProjects() {
  try {
    const commons = yield call(
      CommonService.getUserCommons,
      "jTvCqKFjlVaNfANUPJq4v8d5bI43",
    );

    yield put(actions.getProjects.success({ commons }));
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getProjects.failure(error));
    }
  }
}

export function* mainSaga() {
  yield takeLatest(actions.getProjects.request, getProjects);
}
