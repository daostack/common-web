import { CommonService, GovernanceService, ProjectService } from "@/services";
import { ProjectsStateItem } from "../../../projects";
import { getPermissionsDataByAllUserCommonMemberInfo } from "./getPermissionsDataByAllUserCommonMemberInfo";
import { SpaceListVisibility } from "@/shared/interfaces";

export const getProjects = async (
  commonId: string,
  userId?: string,
): Promise<ProjectsStateItem[]> => {
  const [commonsWithoutMainParentCommon, allUserCommonMemberInfo] =
    await Promise.all([
      CommonService.getCommonsByRootCommonId(commonId),
      userId ? await CommonService.getAllUserCommonMemberInfo(userId) : [],
    ]);
  const userCommonIds = allUserCommonMemberInfo.map((item) => item.commonId);
  const governanceList = await GovernanceService.getGovernanceListByCommonIds(
    userCommonIds,
  );
  const permissionsData = getPermissionsDataByAllUserCommonMemberInfo(
    allUserCommonMemberInfo,
    governanceList,
  );
  const data = ProjectService.parseDataToProjectsInfo(
    commonsWithoutMainParentCommon,
    userCommonIds,
    permissionsData,
  );

  return data.map(
    ({
      common,
      hasAccessToSpace,
      hasMembership,
      hasPermissionToAddProject,
      hasPermissionToLinkToHere,
      hasPermissionToMoveToHere,
    }) => ({
      commonId: common.id,
      image: common.image,
      name: common.name,
      directParent: common.directParent,
      rootCommonId: common.rootCommonId,
      hasAccessToSpace,
      hasMembership,
      hasPermissionToAddProject,
      hasPermissionToLinkToHere,
      hasPermissionToMoveToHere,
      notificationsAmount: 0,
      listVisibility: common.listVisibility
    }),
  ).filter(({hasAccessToSpace}) => hasAccessToSpace);
};
