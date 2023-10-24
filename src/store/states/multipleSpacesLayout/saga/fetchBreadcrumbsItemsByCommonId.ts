import { call, put, select } from "redux-saga/effects";
import { selectUser } from "@/pages/Auth/store/selectors";
import { CommonService, GovernanceService, ProjectService } from "@/services";
import { InboxItemType } from "@/shared/constants";
import { Awaited } from "@/shared/interfaces";
import { Common, User } from "@/shared/models";
import { compareCommonsByLastActivity } from "@/shared/utils";
import { getPermissionsDataByAllUserCommonMemberInfo } from "../../commonLayout/saga/utils";
import * as actions from "../actions";
import { selectMultipleSpacesLayoutBreadcrumbs } from "../selectors";
import { MultipleSpacesLayoutState, ProjectsStateItem } from "../types";

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
  let lastParentCommon: Common | null = !commonForSiblings.directParent
    ? commonForSiblings
    : null;

  while (commonForSiblings?.directParent?.commonId) {
    const commonIdForProjects = commonForSiblings.directParent.commonId;
    const commonProjects = await CommonService.getCommonsByDirectParentIds([
      commonIdForProjects,
    ]);
    commonForSiblings = await CommonService.getCommonById(commonIdForProjects);
    finalCommons.push(...commonProjects);

    if (!commonForSiblings?.directParent) {
      lastParentCommon = commonForSiblings;
    }
  }

  const allUserCommonMemberInfo = userId
    ? await CommonService.getAllUserCommonMemberInfo(userId)
    : [];
  const userCommonIds = allUserCommonMemberInfo.map((item) => item.commonId);
  const [userCommons, activeCommonProjects, governanceList] = await Promise.all(
    [
      CommonService.getParentCommonsByIds(userCommonIds),
      CommonService.getCommonsByDirectParentIds([commonId]),
      GovernanceService.getGovernanceListByCommonIds(userCommonIds),
    ],
  );
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

  finalCommons.push(...userCommons, ...activeCommonProjects);

  return ProjectService.parseDataToProjectsInfo(
    finalCommons,
    userCommonIds,
    permissionsData,
  );
};

export function* fetchBreadcrumbsItemsByCommonId(
  action: ReturnType<typeof actions.fetchBreadcrumbsItemsByCommonId.request>,
) {
  const { payload: commonId } = action;

  if (!commonId) {
    return;
  }

  const currentBreadcrumbs = (yield select(
    selectMultipleSpacesLayoutBreadcrumbs,
  )) as MultipleSpacesLayoutState["breadcrumbs"];

  if (currentBreadcrumbs?.type !== InboxItemType.FeedItemFollow) {
    return;
  }

  yield put(
    actions.setBreadcrumbsData({
      ...currentBreadcrumbs,
      areItemsLoading: true,
      areItemsFetched: false,
    }),
  );

  try {
    const user = (yield select(selectUser())) as User | null;
    const projectsInfo = (yield call(
      fetchProjectsInfoByActiveCommonId,
      commonId,
      user?.uid,
    )) as Awaited<ReturnType<typeof fetchProjectsInfoByActiveCommonId>>;
    console.log(projectsInfo.map((c) => c));
    console.log(projectsInfo.map((c) => c.common.updatedAt));
    const projectsData: ProjectsStateItem[] = [...projectsInfo]
      .sort((prevItem, nextItem) =>
        compareCommonsByLastActivity(prevItem.common, nextItem.common),
      )
      .map(({ common, hasMembership, hasPermissionToAddProject }) => ({
        commonId: common.id,
        image: common.image,
        name: common.name,
        directParent: common.directParent,
        hasMembership,
        hasPermissionToAddProject,
      }));

    const currentBreadcrumbs = (yield select(
      selectMultipleSpacesLayoutBreadcrumbs,
    )) as MultipleSpacesLayoutState["breadcrumbs"];

    if (currentBreadcrumbs?.type === InboxItemType.FeedItemFollow) {
      yield put(
        actions.setBreadcrumbsData({
          ...currentBreadcrumbs,
          items: projectsData,
          areItemsLoading: false,
          areItemsFetched: true,
        }),
      );
    }
  } catch (error) {
    const currentBreadcrumbs = (yield select(
      selectMultipleSpacesLayoutBreadcrumbs,
    )) as MultipleSpacesLayoutState["breadcrumbs"];

    if (currentBreadcrumbs?.type === InboxItemType.FeedItemFollow) {
      yield put(
        actions.setBreadcrumbsData({
          ...currentBreadcrumbs,
          items: [],
          areItemsLoading: false,
          areItemsFetched: true,
        }),
      );
    }
  }
}
