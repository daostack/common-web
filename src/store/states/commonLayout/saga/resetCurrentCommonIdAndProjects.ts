import { put, select } from "redux-saga/effects";
import { selectCommonLayoutCommonId } from "@/store/states";
import * as actions from "../actions";

export function* resetCurrentCommonIdAndProjects(
  action: ReturnType<typeof actions.resetCurrentCommonIdAndProjects>,
) {
  const { payload: commonId } = action;
  const currentCommonId = (yield select(selectCommonLayoutCommonId)) as
    | string
    | null;

  if (currentCommonId && commonId && commonId !== currentCommonId) {
    yield put(actions.setCurrentCommonId(commonId));
    yield put(actions.clearProjects());
  }
}
