import { call, put, select, takeLatest } from "redux-saga/effects";
import { selectUser } from "@/pages/Auth/store/selectors";
import { CommonService } from "@/services";
import { Awaited } from "@/shared/interfaces";
import { User } from "@/shared/models";
import { isError } from "@/shared/utils";
import { ProjectsStateItem } from "@/store/states";
import * as actions from "./actions";

function* getProjects() {
  try {
    const user = (yield select(selectUser())) as User | null;

    if (!user) {
      throw new Error("There is no user to fetch projects");
    }

    const data = (yield call(
      CommonService.getUserProjectsInfo,
      user.id,
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
