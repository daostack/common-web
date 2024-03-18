import { call, put, select, takeLatest } from "redux-saga/effects";
import { selectUser } from "@/pages/Auth/store/selectors";
import { ProjectService } from "@/services";
import { Awaited } from "@/shared/interfaces";
import { User } from "@/shared/models";
import { isError } from "@/shared/utils";
import * as actions from "./actions";
import { ProjectsStateItem } from "./types";

function* getProjects(action: ReturnType<typeof actions.getProjects.request>) {
  const { payload: additionalIdToFetch = "" } = action;

  try {
    const user = (yield select(selectUser())) as User | null;
    const userId = user?.uid;

    const data = (yield call(
      ProjectService.getProjectsInfo,
      userId,
      additionalIdToFetch,
    )) as Awaited<ReturnType<typeof ProjectService.getProjectsInfo>>;
    const projectsData: ProjectsStateItem[] = data.map(
      ({ common, hasMembership }) => ({
        commonId: common.id,
        image: common.image,
        name: common.name,
        directParent: common.directParent,
        rootCommonId: common.rootCommonId,
        hasMembership,
        notificationsAmount: 0,
        listVisibility: common.listVisibility,
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
