import { call, put, select } from "redux-saga/effects";
import { selectUser } from "@/pages/Auth/store/selectors";
import { CommonService, GovernanceService, ProjectService } from "@/services";
import { InboxItemType } from "@/shared/constants";
import { Awaited } from "@/shared/interfaces";
import { Common, User } from "@/shared/models";
import { getPermissionsDataByAllUserCommonMemberInfo } from "../../commonLayout/saga/utils";
import * as actions from "../actions";
import { selectMultipleSpacesLayoutBreadcrumbs } from "../selectors";
import {
  MultipleSpacesLayoutFeedItemBreadcrumbs,
  MultipleSpacesLayoutState,
  ProjectsStateItem,
} from "../types";

const fetchProjectsInfoByActiveCommonId = async (
  commonId: string,
  userId?: string,
): Promise<ReturnType<typeof ProjectService.parseDataToProjectsInfo>> => {
  const activeCommon = await CommonService.getCommonById(commonId);

  if (!activeCommon) {
    return [];
  }

  const finalCommons: Common[] = [];
  let commonForSiblings: Common | null = activeCommon;
  let lastParentCommon: Common | null = null;

  while (commonForSiblings?.directParent?.commonId) {
    const commonIdForSubCommons = commonForSiblings.directParent.commonId;
    const commonSubCommons = await CommonService.getCommonsByDirectParentIds([
      commonIdForSubCommons,
    ]);
    commonForSiblings = await CommonService.getCommonById(
      commonIdForSubCommons,
    );
    finalCommons.push(...commonSubCommons);

    if (!commonForSiblings?.directParent) {
      lastParentCommon = commonForSiblings;
    }
  }

  const allUserCommonMemberInfo = userId
    ? await CommonService.getAllUserCommonMemberInfo(userId)
    : [];
  const userCommonIds = allUserCommonMemberInfo.map((item) => item.commonId);
  const [userCommons, activeCommonSubCommons, governanceList] =
    await Promise.all([
      CommonService.getParentCommonsByIds(userCommonIds),
      CommonService.getCommonsByDirectParentIds([commonId]),
      GovernanceService.getGovernanceListByCommonIds(userCommonIds),
    ]);
  const permissionsData = getPermissionsDataByAllUserCommonMemberInfo(
    allUserCommonMemberInfo,
    governanceList,
  );

  if (
    lastParentCommon &&
    !userCommons.some((common) => common.id === lastParentCommon?.id)
  ) {
    userCommons.push(lastParentCommon);
  }

  finalCommons.push(...userCommons, ...activeCommonSubCommons);

  return ProjectService.parseDataToProjectsInfo(
    finalCommons,
    userCommonIds,
    permissionsData,
  );
};

export function* fetchBreadcrumbsData(
  action: ReturnType<typeof actions.fetchBreadcrumbsData.request>,
) {
  const { payload } = action;

  if (payload.type === InboxItemType.ChatChannel) {
    yield put(
      actions.setBreadcrumbsData({
        type: InboxItemType.ChatChannel,
        activeItem: { ...payload.activeItem },
      }),
    );
    return;
  }

  const currentBreadcrumbs = (yield select(
    selectMultipleSpacesLayoutBreadcrumbs,
  )) as MultipleSpacesLayoutState["breadcrumbs"];

  if (
    currentBreadcrumbs?.type === InboxItemType.FeedItemFollow &&
    currentBreadcrumbs?.activeCommonId === payload.activeCommonId &&
    payload.activeItem
  ) {
    yield put(
      actions.setBreadcrumbsData({
        ...currentBreadcrumbs,
        activeItem: { ...payload.activeItem },
      }),
    );
    return;
  }

  const nextBreadcrumbs: MultipleSpacesLayoutFeedItemBreadcrumbs = {
    type: InboxItemType.FeedItemFollow,
    activeItem: payload.activeItem ? { ...payload.activeItem } : null,
    activeCommonId: payload.activeCommonId,
    items: [],
    areItemsLoading: true,
    areItemsFetched: false,
  };
  yield put(actions.setBreadcrumbsData(nextBreadcrumbs));

  try {
    const user = (yield select(selectUser())) as User | null;
    const projectsInfo = (yield call(
      fetchProjectsInfoByActiveCommonId,
      payload.activeCommonId,
      user?.uid,
    )) as Awaited<ReturnType<typeof fetchProjectsInfoByActiveCommonId>>;
    const projectsData: ProjectsStateItem[] = projectsInfo.map(
      ({ common, hasMembership, hasPermissionToAddProject }) => ({
        commonId: common.id,
        image: common.image,
        name: common.name,
        directParent: common.directParent,
        hasMembership,
        hasPermissionToAddProject,
      }),
    );

    yield put(
      actions.setBreadcrumbsData({
        ...nextBreadcrumbs,
        items: projectsData,
        areItemsLoading: false,
        areItemsFetched: true,
      }),
    );
  } catch (error) {
    yield put(
      actions.setBreadcrumbsData({
        ...nextBreadcrumbs,
        items: [],
        areItemsLoading: false,
        areItemsFetched: true,
      }),
    );
  }
}
