import { takeLatest } from "redux-saga/effects";
import * as actions from "../actions";
import { getProjects } from "./getProjects";

export function* mainSaga() {
  yield takeLatest(actions.getProjects.request, getProjects);
}
