import { call, put, select } from "redux-saga/effects";
import { selectUser } from "@/pages/Auth/store/selectors";
import { CommonService, GovernanceService, ProjectService } from "@/services";
import { Awaited } from "@/shared/interfaces";
import { User } from "@/shared/models";
import { isError } from "@/shared/utils";
import { ProjectsStateItem } from "../../projects";
import * as actions from "../actions";
import { getPermissionsDataByAllUserCommonMemberInfo } from "./utils";

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
    const allUserCommonMemberInfo = userId
      ? ((yield call(
          CommonService.getAllUserCommonMemberInfo,
          userId,
        )) as Awaited<
          ReturnType<typeof CommonService.getAllUserCommonMemberInfo>
        >)
      : [];
    const userCommonIds = allUserCommonMemberInfo.map((item) => item.commonId);
    const governanceList = (yield call(
      GovernanceService.getGovernanceListByCommonIds,
      userCommonIds,
    )) as Awaited<
      ReturnType<typeof GovernanceService.getGovernanceListByCommonIds>
    >;
    const permissionsData = getPermissionsDataByAllUserCommonMemberInfo(
      allUserCommonMemberInfo,
      governanceList,
    );
    const data = ProjectService.parseDataToProjectsInfo(
      commonsWithoutMainParentCommon,
      userCommonIds,
      permissionsData,
    );
    const projectsData: ProjectsStateItem[] = data.map(
      ({ common, hasMembership, hasPermissionToAddProject }) => ({
        commonId: common.id,
        image: common.image,
        name: common.name,
        directParent: common.directParent,
        rootCommonId: common.rootCommonId,
        hasMembership,
        hasPermissionToAddProject,
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
