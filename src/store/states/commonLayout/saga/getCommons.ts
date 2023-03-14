import { call, put, select } from "redux-saga/effects";
import { selectUser } from "@/pages/Auth/store/selectors";
import { CommonService, ProjectService } from "@/services";
import { Awaited } from "@/shared/interfaces";
import { User } from "@/shared/models";
import { isError } from "@/shared/utils";
import { ProjectsStateItem } from "../../projects";
import * as actions from "../actions";

const getProjectsInfo = async (
  commonId: string,
  userId?: string,
): Promise<{
  data: ReturnType<typeof ProjectService.parseDataToProjectsInfo>;
  currentCommonId: string | null;
}> => {
  const userCommonIds = userId
    ? await CommonService.getUserCommonIds(userId)
    : [];
  const userCommons = await CommonService.getParentCommonsByIds(userCommonIds);
  const data = ProjectService.parseDataToProjectsInfo(
    userCommons,
    userCommonIds,
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
    ...ProjectService.parseDataToProjectsInfo([parentCommon], userCommonIds),
  );

  return {
    data: finalData,
    currentCommonId,
  };
};

export function* getCommons(
  action: ReturnType<typeof actions.getCommons.request>,
) {
  const { payload: commonId = "" } = action;

  try {
    const user = (yield select(selectUser())) as User | null;
    const userId = user?.uid;
    const { data, currentCommonId } = (yield call(
      getProjectsInfo,
      commonId,
      userId,
    )) as Awaited<ReturnType<typeof getProjectsInfo>>;
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
