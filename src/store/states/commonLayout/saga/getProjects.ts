import { call, put, select } from "redux-saga/effects";
import { selectUser } from "@/pages/Auth/store/selectors";
import { CommonService, ProjectService } from "@/services";
import { Awaited } from "@/shared/interfaces";
import { User } from "@/shared/models";
import { isError } from "@/shared/utils";
import { ProjectsStateItem } from "../../projects";
import * as actions from "../actions";

export function* getProjects(
  action: ReturnType<typeof actions.getProjects.request>,
) {
  const { payload: commonId } = action;

  try {
    const user = (yield select(selectUser())) as User | null;
    const userId = user?.uid;

    const commonsWithSubCommons = (yield call(
      CommonService.getCommonsWithSubCommons,
      [commonId],
    )) as Awaited<ReturnType<typeof CommonService.getCommonsWithSubCommons>>;
    const commonsWithoutMainParentCommon = commonsWithSubCommons.filter(
      (common) => common.id !== commonId,
    );
    const userCommonIds = userId
      ? ((yield call(CommonService.getUserCommonIds, userId)) as Awaited<
          ReturnType<typeof CommonService.getUserCommonIds>
        >)
      : [];
    const data = ProjectService.parseDataToProjectsInfo(
      commonsWithoutMainParentCommon,
      userCommonIds,
    );
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
