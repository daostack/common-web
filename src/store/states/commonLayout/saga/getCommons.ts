import { call, put, select } from "redux-saga/effects";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  CommonService,
  GovernanceService,
  ProjectService,
  UserActivityService,
} from "@/services";
import { Awaited } from "@/shared/interfaces";
import { User } from "@/shared/models";
import { compareCommonsByLastActivity, isError } from "@/shared/utils";
import { ProjectsStateItem } from "../../projects";
import * as actions from "../actions";
import { getPermissionsDataByAllUserCommonMemberInfo } from "./utils";

const getProjectsInfo = async (
  commonId: string,
  userId?: string,
): Promise<{
  data: ReturnType<typeof ProjectService.parseDataToProjectsInfo>;
  currentCommonId: string | null;
}> => {
  const allUserCommonMemberInfo = userId
    ? await CommonService.getAllUserCommonMemberInfo(userId)
    : [];
  const userCommonIds = allUserCommonMemberInfo.map((item) => item.commonId);
  const [userCommons, governanceList] = await Promise.all([
    CommonService.getParentCommonsByIds(userCommonIds),
    GovernanceService.getGovernanceListByCommonIds(userCommonIds),
  ]);
  const permissionsData = getPermissionsDataByAllUserCommonMemberInfo(
    allUserCommonMemberInfo,
    governanceList,
  );
  const data = ProjectService.parseDataToProjectsInfo(
    userCommons,
    userCommonIds,
    permissionsData,
  );

  if (userCommons.some((common) => common.id === commonId)) {
    return {
      data,
      currentCommonId: commonId,
    };
  }

  const parentCommon = await CommonService.getParentCommonForCommonId(commonId);
  const currentCommonId = parentCommon?.id || data[0]?.common.id || null;

  if (
    !parentCommon ||
    userCommons.some((common) => common.id === parentCommon.id)
  ) {
    return {
      data,
      currentCommonId,
    };
  }

  const finalData = data.concat(
    ...ProjectService.parseDataToProjectsInfo(
      [parentCommon],
      userCommonIds,
      permissionsData,
    ),
  );

  return {
    data: finalData,
    currentCommonId,
  };
};

export function* getCommons(
  action: ReturnType<typeof actions.getCommons.request>,
) {
  let { payload: commonId = "" } = action;

  try {
    const user = (yield select(selectUser())) as User | null;
    const userId = user?.uid;

    if (!commonId && userId) {
      const userActivity = (yield call(
        UserActivityService.getUserActivity,
        userId,
      )) as Awaited<ReturnType<typeof UserActivityService.getUserActivity>>;
      commonId = userActivity?.lastVisitedCommon || "";
    }

    const { data, currentCommonId } = (yield call(
      getProjectsInfo,
      commonId,
      userId,
    )) as Awaited<ReturnType<typeof getProjectsInfo>>;
    const projectsData: ProjectsStateItem[] = [...data]
      .sort((prevItem, nextItem) =>
        compareCommonsByLastActivity(prevItem.common, nextItem.common),
      )
      .map(
        ({
          common,
          hasMembership,
          hasPermissionToAddProject,
          hasPermissionToLinkToHere,
        }) => ({
          commonId: common.id,
          image: common.image,
          name: common.name,
          directParent: common.directParent,
          rootCommonId: common.rootCommonId,
          hasMembership,
          hasPermissionToAddProject,
          hasPermissionToLinkToHere,
          notificationsAmount: 0,
        }),
      );

    yield put(
      actions.getCommons.success({
        data: projectsData,
        currentCommonId,
      }),
    );
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getCommons.failure(error));
    }
  }
}
