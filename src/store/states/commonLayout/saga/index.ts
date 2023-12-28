import { takeLatest } from "redux-saga/effects";
import * as actions from "../actions";
import { getCommons } from "./getCommons";
import { getProjects } from "./getProjects";
import { resetCurrentCommonIdAndProjects } from "./resetCurrentCommonIdAndProjects";

export function* mainSaga() {
  yield takeLatest(actions.getCommons.request, getCommons);
  yield takeLatest(actions.getProjects.request, getProjects);
  yield takeLatest(
    actions.resetCurrentCommonIdAndProjects,
    resetCurrentCommonIdAndProjects,
  );
}
