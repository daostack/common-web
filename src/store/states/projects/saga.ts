import { call, put, takeLatest } from "redux-saga/effects";
import { CommonService } from "@/services";
import { Awaited } from "@/shared/interfaces";
import { isError } from "@/shared/utils";
import { ProjectsStateItem } from "@/store/states";
import * as actions from "./actions";

function* getProjects() {
  try {
    const data = (yield call(
      CommonService.getUserProjectsInfo,
      "jTvCqKFjlVaNfANUPJq4v8d5bI43",
    )) as Awaited<ReturnType<typeof CommonService.getUserProjectsInfo>>;
    const projectsData: ProjectsStateItem[] = data.map(
      ({ common, hasMembership }) => ({
        commonId: common.id,
        image: common.image,
        name: common.name,
        directParent: common.directParent,
        hasMembership,
        notificationsAmount: 0,
      }),
    );

    yield put(actions.getProjects.success(projectsData));
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getProjects.failure(error));
    }
  }
}

export function* mainSaga() {
  yield takeLatest(actions.getProjects.request, getProjects);
}
